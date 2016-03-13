module PowerBiViewer.Controllers {
	export interface IReportController {
		report: Models.PowerBiReportModel;
		sendToken(width: number, height: number): void;
	}

	interface IReportRouteParams {
		isId: string;
		report: string;
		group: string;
	}

	interface IPowerBiMessage {
		event: string;
	}

	export class ReportController implements IReportController {
		static $inject: Array<string> = ['IPowerBiService', 'adalAuthenticationService', '$routeParams', '$log', '$window'];

		report: Models.PowerBiReportModel;

		private _adal;
		private _log: ng.ILogService;

		constructor(pbiService: Config.IPowerBiService, adalProvider, $routeParams: IReportRouteParams, $log: ng.ILogService, $window: ng.IWindowService) {
			this._adal = adalProvider;
			this._log = $log;

			var groupPart = (typeof $routeParams.group === "undefined" ? "" : ("&groupId=" + $routeParams.group));

			if ($routeParams.isId === "true") {
				this.report = {
					id: $routeParams.report,
					name: "<undefined when using ID>",
					embedUrl: "https://app.powerbi.com/reportEmbed?reportId=" + $routeParams.report + groupPart,
					webUrl: "https://app.powerbi.com/reports/" + $routeParams.report,
				};
			} else {
				pbiService.getReport($routeParams.report)
					.then(report => this.report = report);
			}

			$window.onmessage = (ev: MessageEvent) => {
				if (ev.data) {
					try {
						var data: IPowerBiMessage = JSON.parse(ev.data);
						if (data.event === "reportClicked") {

							$window.open(this.report.webUrl, this.report.id, null, true);
						}
					}
					catch (e) {
						this._log.error("Unable to read message data from Power BI iframe");
					}
				}
			};
		}

		sendToken(width: number, height: number): void {
			if (!this.report || !this.report.id || width <= 0 || height <= 0) {
				return;
			}

			(<ng.IPromise<string>>this._adal.acquireToken("https://analysis.windows.net/powerbi/api"))
				.then(token => {
					if (token === null || token.length <= 0) {
						this._log.error("Unable to send access token to report view - no token available");
						return;
					}

					var iframe = <HTMLIFrameElement>document.getElementById(this.report.id);
					if (!iframe || !iframe.contentWindow) {
						this._log.error("Unable to send access token to report view - no iframe found with id '" + this.report.id + "'");
						return;
					}

					this._log.debug("Sending Token");
					iframe.contentWindow.postMessage(JSON.stringify({ action: "loadReport", accessToken: token, width: width, height: height }), "*");

				})
				.catch(error => {
					this._log.error("Token not available... Message: '" + error + "'");
				});
		}
	}
}
