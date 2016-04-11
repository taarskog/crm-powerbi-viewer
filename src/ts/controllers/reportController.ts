module PowerBiViewer.Controllers {
	export interface IReportController {
		report: Models.PowerBiReportModel;
		sendToken(width: number, height: number): void;
	}

	interface IPowerBiMessage {
		event: string;
	}

	export class ReportController implements IReportController {
		static $inject: Array<string> = ['IPowerBiService', 'adalAuthenticationService', '$log', '$window', 'IViewConfig'];

		report: Models.PowerBiReportModel;

		private _adal;
		private _log: ng.ILogService;
		private _filter: string;

		constructor(pbiService: Config.IPowerBiService, adalProvider, $log: ng.ILogService, $window: ng.IWindowService, viewConfig: Config.IViewConfig) {
			this._adal = adalProvider;
			this._log = $log;

			if (typeof viewConfig.powerBi.filterFn !== "undefined" && viewConfig.powerBi.filterFn.length > 0) {
				this._filter = <string>this.executeFunctionByName(viewConfig.powerBi.filterFn, $window);
			}

			if (typeof this._filter === "undefined" || this._filter.length === 0) {
				this._filter = null;
			}

			var isId = typeof viewConfig.powerBi.reportId !== "undefined";

			var groupPart = (typeof viewConfig.powerBi.groupId === "undefined" ? "" : ("&groupId=" + viewConfig.powerBi.groupId));

			if (isId === true) {
				this.report = {
					id: viewConfig.powerBi.reportId,
					name: "<undefined when using ID>",
					embedUrl: "https://app.powerbi.com/reportEmbed?reportId=" + viewConfig.powerBi.reportId + groupPart,
					webUrl: "https://app.powerbi.com/reports/" + viewConfig.powerBi.reportId,
				};
			} else {
				pbiService.getReport(viewConfig.powerBi.reportName)
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

		executeFunctionByName(functionName, context): any {
			var namespaces = functionName.split(".");
			var func = namespaces.pop();
			for (var i = 0; i < namespaces.length; i++) {
				context = context[namespaces[i]];
			}

			return context[func].apply(context);
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
					iframe.contentWindow.postMessage(JSON.stringify({ action: "loadReport", accessToken: token, width: width, height: height, oDataFilter: this._filter }), "*");

				})
				.catch(error => {
					this._log.error("Token not available... Message: '" + error + "'");
				});
		}
	}
}
