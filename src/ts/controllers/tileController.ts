module PowerBiViewer.Controllers {
	export interface ITileController {
		tile: Models.PowerBiTileModel;
		sendToken(width: number, height: number): void;
	}

	interface ITileRouteParams {
		isId: string;
		dashboard: string;
		tile: string;
		group: string;
	}

	interface IPowerBiMessage {
		event: string;
	}

	export class TileController implements ITileController {
		static $inject: Array<string> = ['IPowerBiService', 'adalAuthenticationService', '$routeParams', '$log', '$window'];

		tile: Models.PowerBiTileModel;

		private _adal;
		private _log: ng.ILogService;
		private _window: ng.IWindowService;

		constructor(pbiService: Config.IPowerBiService, adalProvider, $routeParams: ITileRouteParams, $log: ng.ILogService, $window: ng.IWindowService) {
			this._adal = adalProvider;
			this._log = $log;
			this._window = $window;

			var groupPart = (typeof $routeParams.group === "undefined" ? "" : ("&groupId=" + $routeParams.group));

			if ($routeParams.isId === "true") {
				this.tile = {
					id: $routeParams.tile,
					title: "<undefined when using ID>",
					embedUrl: "https://app.powerbi.com/embed?dashboardId=" + $routeParams.dashboard + "&tileId=" + $routeParams.tile + groupPart
				};
			} else {
				pbiService.getTile($routeParams.dashboard, $routeParams.tile)
					.then(tile => {
						this.tile = tile;
					}
				);
			}

			$window.onmessage = (ev: MessageEvent) => {
				if (ev.data) {
					try {
						var data: IPowerBiMessage = JSON.parse(ev.data);
						if (data.event === "tileClicked") {

							var iFrameSrc = (<HTMLIFrameElement>$window.document.getElementById(this.tile.id)).src;
							var dashboardId = iFrameSrc.split("dashboardId=")[1].split("&")[0];
							var urlVal = iFrameSrc.split("/embed")[0] + "/dashboards/{0}";
							urlVal = urlVal.replace("{0}", dashboardId)

							$window.open(urlVal, this.tile.id, null, true);
						}
					}
					catch (e) {
						this._log.error("Unable to read message data from Power BI iframe");
					}
				}
			};
		}

		sendToken(width: number, height: number): void {
			if (!this.tile || !this.tile.id || width <= 0 || height <= 0) {
				return;
			}

			(<ng.IPromise<string>>this._adal.acquireToken("https://analysis.windows.net/powerbi/api"))
				.then(token => {
					if (token === null || token.length <= 0) {
						this._log.error("Unable to send access token to tile view - no token available");
						return;
					}

					var iframe = <HTMLIFrameElement>document.getElementById(this.tile.id);
					if (!iframe || !iframe.contentWindow) {
						this._log.error("Unable to send access token to tile view - no iframe found with id '" + this.tile.id + "'");
						return;
					}

					this._log.debug("Sending Token");
					iframe.contentWindow.postMessage(JSON.stringify({ action: "loadTile", accessToken: token, width: width, height: height }), "*");

				})
				.catch(error => {
					this._log.error("Token not available... Message: '" + error + "'");
				});
		}
	}
}
