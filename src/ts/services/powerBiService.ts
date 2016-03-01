module PowerBiViewer.Services {
	export interface IPowerBiService {
		getTile(dashboardName: string, tileName: string): ng.IPromise<Models.PowerBiTileModel>;
		getReport(reportName: string): ng.IPromise<Models.PowerBiReportModel>;

		getDashboards(): ng.IPromise<Models.PowerBiDashboardModel[]>;
		getDashboardTiles(dashboardId: string): ng.IPromise<Models.PowerBiTileModel[]>;
		getAllReports(): ng.IPromise<Models.PowerBiReportModel[]>;
	}

	export class PowerBiService implements IPowerBiService {
		static $inject: Array<string> = ['$http'];

		private _http: ng.IHttpService;

		constructor($http: ng.IHttpService) {
			this._http = $http;
		}

		/**
		 * Get tile by named dashboard and tile
		 * @param dashboardName Name of dashboard
		 * @param tileName Name of tile
		 */
		getTile(dashboardName: string, tileName: string): ng.IPromise<Models.PowerBiTileModel> {
			// Get all dashboards
			return this.getDashboards()

				// Search for named dashboard
				.then(response => {
					var dashboard: Models.PowerBiDashboardModel = null;
					response.forEach(item => {
						if (item.displayName === dashboardName) {
							dashboard = item;
							return false;
						}
					});

					return dashboard;
				})
				
				// Get all tiles on named dashboard
				.then(dashboard => {
					if (dashboard === null) {
						return null;
					}

					return this.getDashboardTiles(dashboard.id);
				})

				// Search for named tile
				.then(response => {
					var tile: Models.PowerBiTileModel = null;
					response.forEach(item => {
						if (item.title === tileName) {
							tile = item;
							return false;
						}
					});

					return tile;
				});
		}

		/**
		 * Get report by name
		 * @param reportName Name of report
		 */
		getReport(reportName: string): ng.IPromise<Models.PowerBiReportModel> {
			// Get all reports
			return this._http.get('https://api.powerbi.com/beta/myorg/reports')

				// Search for named report
				.then(response => {
					var report: Models.PowerBiReportModel = null;
					(<Models.PowerBiReportModel[]>(<any>response.data).value).forEach(item => {
						if (item.name === reportName) {
							report = item;
							return false;
						}
					});

					return report;
				});
		}

		getAllReports(): ng.IPromise<Models.PowerBiReportModel[]> {
			return this._http.get('https://api.powerbi.com/beta/myorg/reports')
				.then(response => {
					return <Models.PowerBiReportModel[]>(<any>response.data).value;
				});
		}

		getDashboards(): ng.IPromise<Models.PowerBiDashboardModel[]> {
			return this._http.get('https://api.powerbi.com/beta/myorg/dashboards')
				.then(response => {
					return <Models.PowerBiDashboardModel[]>(<any>response.data).value
				});
		}

		getDashboardTiles(dashboardId: string): ng.IPromise<Models.PowerBiTileModel[]> {
			// Get all dashboards
			return this._http.get('https://api.powerbi.com/beta/myorg/dashboards/' + dashboardId + '/tiles')
				.then(response => {
					return <Models.PowerBiTileModel[]>(<any>response.data).value
				});
		}
	}
}