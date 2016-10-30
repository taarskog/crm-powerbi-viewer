module PowerBiViewer.Controllers {

	export interface IConfigController {
		dashboards: Models.PowerBiDashboardInfoModel[];
		reports: Models.PowerBiReportModel[];
		groups: Models.PowerBiGroupModel[];
		getUrlQueryFromCrmDataString(crmData: string): string;
	}

	export class ConfigController implements IConfigController {
		static $inject: Array<string> = ['IPowerBiService', 'IAuthService'];

		dashboards: Models.PowerBiDashboardInfoModel[];
		reports: Models.PowerBiReportModel[];
		groups: Models.PowerBiGroupModel[];

		constructor(pbiService: Services.IPowerBiService, authService: Services.IAuthService) {
			this.dashboards = [];
			this.reports = [];
			this.reports = [];

			authService.waitForAuth().then(() => {
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


							pbiService.getGroupReports(grp.id)
								.then(reports => { grp.reports = reports; });
						})

						this.groups = result;
					});
			});
		}

		getUrlQueryFromCrmDataString(crmData: string): string {
			return "data=" + encodeURIComponent(crmData);
		}
	}
}
