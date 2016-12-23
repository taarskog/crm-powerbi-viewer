module PowerBiViewer.Controllers {
	export interface ITileController {
		tile: Models.PowerBiTileModel;
		sendToken(width: number, height: number): void;
	}

	interface IPowerBiMessage {
		event: string;
	}

	export class TileController implements ITileController {
		static $inject: Array<string> = ['IPowerBiService', 'IAuthService', 'adalAuthenticationService', '$log', '$window', 'IViewConfig'];

		tile: Models.PowerBiTileModel;

		private _adal;
		private _log: ng.ILogService;

		constructor(pbiService: Services.IPowerBiService, authService: Services.IAuthService, adalProvider, $log: ng.ILogService, $window: ng.IWindowService, viewConfig: Config.IViewConfig) {
			this._adal = adalProvider;
			this._log = $log;

			var isId = (typeof viewConfig.powerBi.dashboardId !== "undefined") && (typeof viewConfig.powerBi.tileId !== "undefined");

			var groupPart = (typeof viewConfig.powerBi.groupId === "undefined" ? "" : ("&groupId=" + viewConfig.powerBi.groupId));

			authService.waitForAuth().then(() => {
				if (isId === true) {
					this.tile = {
						id: viewConfig.powerBi.tileId,
						title: "<undefined when using ID>",
						embedUrl: "https://app.powerbi.com/embed?dashboardId=" + viewConfig.powerBi.dashboardId + "&tileId=" + viewConfig.powerBi.tileId + groupPart
					};
				} else {
					pbiService.getTile(viewConfig.powerBi.dashboardName, viewConfig.powerBi.tileName)
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

								var groupPart = "";
								if (iFrameSrc.indexOf("groupId=") > 0) {
									groupPart = "/groups/" + iFrameSrc.split("groupId=")[1].split("&")[0];
								}
								
								var urlVal = iFrameSrc.split("/embed")[0] + groupPart + "/dashboards/{0}";
								urlVal = urlVal.replace("{0}", dashboardId)

								$window.open(urlVal, this.tile.id, null, true);
							}
						}
						catch (e) {
							this._log.error("Unable to read message data from Power BI iframe");
						}
					}
				};
			});
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
