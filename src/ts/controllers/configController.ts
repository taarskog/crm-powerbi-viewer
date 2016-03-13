module PowerBiViewer.Controllers {

	export interface IConfigController {
		dashboards: Models.PowerBiDashboardInfoModel[];
		reports: Models.PowerBiReportModel[];
		groups: Models.PowerBiGroupModel[];
	}

	export class ConfigController implements IConfigController {
		static $inject: Array<string> = ['IPowerBiService', 'adalAuthenticationService'];

		dashboards: Models.PowerBiDashboardInfoModel[];
		reports: Models.PowerBiReportModel[];
		groups: Models.PowerBiGroupModel[];

		private _adal;

		constructor(pbiService: Config.IPowerBiService, adalProvider) {
			this._adal = adalProvider;

			pbiService.getUserDashboards()
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

			pbiService.getGroupsForCurrentUser()
				.then((result: Models.PowerBiGroupModel[]) => {
					result.forEach(grp => {
						pbiService.getGroupDashboards(grp.id)
							.then((result: Models.PowerBiDashboardInfoModel[]) => {
								grp.dashboards = result;

								result.forEach(dash => {
									pbiService.getGroupDashboardTiles(dash.id, grp.id)
										.then(tiles => { dash.tiles = tiles; });
								});
							});
					})

					this.groups = result;
				});
		}
	}
}
