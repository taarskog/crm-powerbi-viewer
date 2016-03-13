
module PowerBiViewer.Config.RouteConfig {
	var _window: ng.IWindowService;
	var _pbiConfig: Models.PowerBiViewConfigModel;

	interface AdalRoute extends ng.route.IRoute {
		requireADLogin: boolean;
	}

	export function configure($routeProvider: ng.route.IRouteProvider, $windowProvider: ng.IServiceProvider, appConfig: Config.IAppConfig, viewConfig: Config.IViewConfig) {
		_window = $windowProvider.$get();
		_pbiConfig = viewConfig.powerBi;

		if (appConfig.isValid) {
			setRoutes($routeProvider);
		}
		else {
			setRouteForInvalidState($routeProvider);
		}
	}
	export module configure {
		export const $inject: Array<string> = ['$routeProvider', '$windowProvider', 'IAppConfig', 'IViewConfig'];
	}

	function setRouteForInvalidState($routeProvider: ng.route.IRouteProvider) {
		$routeProvider.otherwise({ templateUrl: getFullTemplateUrl('views/configerror.html') });
	}

	function setRoutes($routeProvider: ng.route.IRouteProvider): void {
		$routeProvider
			.when('/', getRoute())
			.when('/config', createAdalRoute('views/config.html', 'IConfigController'))
			.when('/tile/:isId/:dashboard/:tile/:group?', createAdalRoute('views/tile.html', 'ITileController'))
			.when('/report/:isId/:report/:group?', createAdalRoute('views/report.html', 'IReportController'))
			.when('/configerror', { templateUrl: getFullTemplateUrl('views/configerror.html') })
			.otherwise({ redirectTo: '/' });
	}

	/**
	 * Create route instructing ADAL to login.
	 * @param templateRelativeUrl The template relative url.
	 * @param controller Name of controller interface.
	 * @remarks ControllerAs = 'vm'.
	 */
	function createAdalRoute(templateRelativeUrl: string, controller: string): AdalRoute {
		return <AdalRoute>{
			templateUrl: getFullTemplateUrl(templateRelativeUrl),
			controller: controller,
			controllerAs: 'vm',
			requireADLogin: true
		};
	}

	/**
	 * Convert relative url to a fully qualified url (required when embedding in Dynamics CRM).
	 * @param templateRelativeUrl The template relative url.
	 * @returns Fully qualified url (assuming app is hosted from 'powerbiviewer.html').
	 */
	function getFullTemplateUrl(templateRelativeUrl): string {
		return _window.location.origin + _window.location.pathname.toLowerCase().replace("powerbiviewer.html", "") + templateRelativeUrl;
	}

	function getRoute() {
		var redirectUrl: string = null;
		switch (_pbiConfig.type) {
			case 'tile':
				redirectUrl = buildTileUrl(_pbiConfig);
				break;
			case 'report':
				redirectUrl = buildReportUrl(_pbiConfig);
				break;
			default:
				redirectUrl = '/configerror';
				break;
		}

		return { redirectTo: redirectUrl };
	}

	function buildTileUrl(pbi: PowerBiViewer.Models.PowerBiViewConfigModel): string {
		var isId = (typeof pbi.dashboardId !== "undefined") && (typeof pbi.tileId !== "undefined");

		if (!isId && (typeof pbi.dashboardName === "undefined" || typeof pbi.tileName === "undefined")) {
			return "/configerror";
		}

		var groupPart = (typeof pbi.groupId === "undefined") ? "" : ("/" + pbi.groupId);

		return '/tile/' + isId + '/' +
			(isId ? pbi.dashboardId : pbi.dashboardName) + '/' +
			(isId ? pbi.tileId : pbi.tileName) +
			groupPart;
	}

	function buildReportUrl(pbi: PowerBiViewer.Models.PowerBiViewConfigModel): string {
		var isId = typeof pbi.reportId !== "undefined";

		if (!isId && typeof pbi.reportName === "undefined") {
			return "/configerror";
		}

		var groupPart = (typeof pbi.groupId === "undefined") ? "" : ("/" + pbi.groupId);

		return '/report/' + isId + '/' +
			(isId ? pbi.reportId : pbi.reportName) +
			groupPart;
	}

}

//module PowerBiViewer.Config {
//	interface AdalRoute extends ng.route.IRoute {
//		requireADLogin: boolean;
//	}

//	export class RouteConfig {
//		static $inject: Array<string> = ['$routeProvider', '$windowProvider', 'IAppConfig', 'IViewConfig'];

//		report: Models.PowerBiReportModel;

//		private _adal;
//		private _log: ng.ILogService;
//		private _window: ng.IWindowService;
//		private _pbiConfig: Models.PowerBiViewConfigModel;

//		constructor($routeProvider: ng.route.IRouteProvider, $windowProvider: ng.IServiceProvider, appConfig: Config.IAppConfig, viewConfig: Config.IViewConfig) {
//			this._window = $windowProvider.$get();
//			this._pbiConfig = viewConfig.powerBi;

//			if (appConfig.isValid) {
//				this.setRoutes($routeProvider);
//			}
//			else {
//				this.setRouteForInvalidState($routeProvider);
//			}
//		}

//		public static configure($routeProvider: ng.route.IRouteProvider, $windowProvider: ng.IServiceProvider, appConfig: Config.IAppConfig, viewConfig: Config.IViewConfig) {
//			new RouteConfig($routeProvider, $windowProvider, appConfig, viewConfig);
//		}

//		private setRouteForInvalidState($routeProvider: ng.route.IRouteProvider) {
//			$routeProvider.otherwise({ templateUrl: this.getFullTemplateUrl('views/configerror.html') });
//		}

//		private setRoutes($routeProvider: ng.route.IRouteProvider): void {
//			$routeProvider
//				.when('/', this.getRoute())
//				.when('/config', this.createAdalRoute('views/config.html', 'IConfigController'))
//				.when('/tile/:isId/:dashboard/:tile/:group?', this.createAdalRoute('views/tile.html', 'ITileController'))
//				.when('/report/:isId/:report/:group?', this.createAdalRoute('views/report.html', 'IReportController'))
//				//.when('/configerror', { templateUrl: getFullTemplateUrl(this._$window, 'views/configerror.html') })
//				.otherwise({ redirectTo: '/' });
//		}

//		/**
//		 * Create route instructing ADAL to login.
//		 * @param templateRelativeUrl The template relative url.
//		 * @param controller Name of controller interface.
//		 * @remarks ControllerAs = 'vm'.
//		 */
//		private createAdalRoute(templateRelativeUrl: string, controller: string): AdalRoute {
//			return <AdalRoute>{
//				templateUrl: this.getFullTemplateUrl(templateRelativeUrl),
//				controller: controller,
//				controllerAs: 'vm',
//				requireADLogin: true
//			};
//		}

//		/**
//		 * Convert relative url to a fully qualified url (required when embedding in Dynamics CRM).
//		 * @param templateRelativeUrl The template relative url.
//		 * @returns Fully qualified url (assuming app is hosted from 'powerbiviewer.html').
//		 */
//		private getFullTemplateUrl(templateRelativeUrl): string {
//			return this._window.location.origin + this._window.location.pathname.toLowerCase().replace("powerbiviewer.html", "") + templateRelativeUrl;
//		}

//		private getRoute() {
//			var redirectUrl: string = null;
//			switch (this._pbiConfig.type) {
//				case 'tile':
//					redirectUrl = this.buildTileUrl(this._pbiConfig);
//					break;
//				case 'report':
//					redirectUrl = this.buildReportUrl(this._pbiConfig);
//					break;
//				default:
//					redirectUrl = '/configerror';
//					break;
//			}

//			return { redirectTo: redirectUrl };
//		}

//		private buildTileUrl(pbi: PowerBiViewer.Models.PowerBiViewConfigModel): string {
//			var isId = (typeof pbi.dashboardId !== "undefined") && (typeof pbi.tileId !== "undefined");

//			if (!isId && (typeof pbi.dashboardName === "undefined" || typeof pbi.tileName === "undefined")) {
//				return "/configerror";
//			}

//			var groupPart = (typeof pbi.groupId === "undefined") ? "" : ("/" + pbi.groupId);

//			return '/tile/' + isId + '/' +
//				(isId ? pbi.dashboardId : pbi.dashboardName) + '/' +
//				(isId ? pbi.tileId : pbi.tileName) +
//				groupPart;
//		}

//		private buildReportUrl(pbi: PowerBiViewer.Models.PowerBiViewConfigModel): string {
//			var isId = typeof pbi.reportId !== "undefined";

//			if (!isId && typeof pbi.reportName === "undefined") {
//				return "/configerror";
//			}

//			var groupPart = (typeof pbi.groupId === "undefined") ? "" : ("/" + pbi.groupId);

//			return '/report/' + isId + '/' +
//				(isId ? pbi.reportId : pbi.reportName) +
//				groupPart;
//		}
//	}
//}