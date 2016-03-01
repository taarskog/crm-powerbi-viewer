module PowerBiViewer.Controllers {

	export interface IConfigController {
		dashboards: Models.PowerBiDashboardInfoModel[];
		reports: Models.PowerBiReportModel[];
		//groups: Models.PowerBiGroup[];
	}

	export class ConfigController implements IConfigController {
		static $inject: Array<string> = ['IPowerBiService', 'adalAuthenticationService'];

		dashboards: Models.PowerBiDashboardInfoModel[];
		reports: Models.PowerBiReportModel[];
		//groups: Models.PowerBiGroup[];

		private _adal;

		constructor(pbiService: Services.IPowerBiService, adalProvider) {
			this._adal = adalProvider;

			pbiService.getDashboards()
				.then((result: Models.PowerBiDashboardInfoModel[]) => {
					result.forEach(dash => {
						pbiService.getDashboardTiles(dash.id)
							.then(tiles => { dash.tiles = tiles; });
					});

					this.dashboards = result;
				});

			pbiService.getAllReports()
				.then((result: Models.PowerBiReportModel[]) => {
					this.reports = result;
				});
		}
	}
}
