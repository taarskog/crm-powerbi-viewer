
module PowerBiViewer.Config.RouteConfig {
	interface AdalRoute extends ng.route.IRoute {
		requireADLogin: boolean;
	}

	export function configure($routeProvider: ng.route.IRouteProvider, $windowProvider: ng.IServiceProvider, appConfig: Config.IAppConfig, viewConfig: Config.IViewConfig) {
		var $window = $windowProvider.$get();
		if (appConfig.isValid) {
			setRoutes($routeProvider, $window, viewConfig.powerBi);
		}
		else {
			setRouteForInvalidState($routeProvider, $window);
		}
	}
	export module configure {
		export const $inject: Array<string> = ['$routeProvider', '$windowProvider', 'IAppConfig', 'IViewConfig'];
	}

	function setRouteForInvalidState($routeProvider: ng.route.IRouteProvider, $window: ng.IWindowService) {
		$routeProvider.otherwise({ templateUrl: getFullTemplateUrl($window, 'views/configerror.html') });
	}

	function setRoutes($routeProvider: ng.route.IRouteProvider, $window: ng.IWindowService, pbiConfig: Models.PowerBiViewConfigModel): void {
		$routeProvider
			.when('/', getRoute(pbiConfig))
			.when('/config', createAdalRoute($window, 'views/config.html', 'IConfigController'))
			.when('/tile', createAdalRoute($window, 'views/tile.html', 'ITileController'))
			.when('/report', createAdalRoute($window, 'views/report.html', 'IReportController'))
			.when('/configerror', { templateUrl: getFullTemplateUrl($window, 'views/configerror.html') })
			.otherwise({ redirectTo: '/' });
	}

	/**
	 * Create route instructing ADAL to login.
	 * @param templateRelativeUrl The template relative url.
	 * @param controller Name of controller interface.
	 * @remarks ControllerAs = 'vm'.
	 */
	function createAdalRoute($window: ng.IWindowService, templateRelativeUrl: string, controller: string): AdalRoute {
		return <AdalRoute>{
			templateUrl: getFullTemplateUrl($window, templateRelativeUrl),
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
	function getFullTemplateUrl($window: ng.IWindowService, templateRelativeUrl: string): string {
		return $window.location.origin + $window.location.pathname.toLowerCase().replace("powerbiviewer.html", "") + templateRelativeUrl;
	}

	function getRoute(pbiConfig: Models.PowerBiViewConfigModel) {
		var redirectUrl: string = null;
		switch (pbiConfig.type) {
			case 'tile':
				redirectUrl = buildTileUrl(pbiConfig);
				break;
			case 'report':
				redirectUrl = buildReportUrl(pbiConfig);
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

		return '/tile';
	}

	function buildReportUrl(pbi: PowerBiViewer.Models.PowerBiViewConfigModel): string {
		var isId = typeof pbi.reportId !== "undefined";

		if (!isId && typeof pbi.reportName === "undefined") {
			return "/configerror";
		}

		return '/report';
	}

}