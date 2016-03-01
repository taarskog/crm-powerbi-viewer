/// <reference path="directives/ng-onload.ts" />
/// <reference path="models/powerbidashboardmodel.ts" />
/// <reference path="models/powerbireportmodel.ts" />
/// <reference path="models/powerbitilemodel.ts" />
/// <reference path="models/powerbidashboardinfomodel.ts" />
/// <reference path="services/configservice.ts" />
/// <reference path="services/powerbiservice.ts" />
/// <reference path="controllers/configcontroller.ts" />
/// <reference path="controllers/reportcontroller.ts" />
/// <reference path="controllers/tilecontroller.ts" />

module PowerBiViewer.App {
	interface AdalRoute extends ng.route.IRoute {
		requireADLogin: boolean;
	}

	angular.module('powerBiViewerApp', ['ngRoute', 'AdalAngular'])
		.service('IPowerBiService', PowerBiViewer.Services.PowerBiService)
		.service('IConfigService', function ($window: ng.IWindowService) { return PowerBiViewer.Services.ConfigService.create($window.location.search); })
		.directive('ngOnload', PowerBiViewer.Directives.onLoadDirective)
		.controller('ITileController', PowerBiViewer.Controllers.TileController)
		.controller('IReportController', PowerBiViewer.Controllers.ReportController)
		.controller('IInfoController', PowerBiViewer.Controllers.ConfigController)
		.config(preventCache)
		.config(configureRoutes)
		.config(configAdal)
		.config(configUrlWhiteList);

	function configureRoutes($routeProvider: ng.route.IRouteProvider, $windowProvider: ng.IServiceProvider) {
		var $window: ng.IWindowService = $windowProvider.$get();
		$routeProvider
			.when('/', getRoute($window))
			.when('/config', <AdalRoute>{
				templateUrl: getFullTemplateUrl($window, 'views/config.html'), controller: 'IConfigController', controllerAs: 'vm', requireADLogin: true
			})
			.when('/tile/:isId/:dashboard/:tile*', <AdalRoute>{
				templateUrl: getFullTemplateUrl($window, 'views/tile.html'), controller: 'ITileController', controllerAs: 'vm', requireADLogin: true
			})
			.when('/report/:isId/:report*', <AdalRoute>{
				templateUrl: getFullTemplateUrl($window, 'views/report.html'), controller: 'IReportController', controllerAs: 'vm', requireADLogin: true
			})
			.when('/configerror', { templateUrl: getFullTemplateUrl($window, 'views/configerror.html') })
			.otherwise({ redirectTo: '/' });
	}

	function getFullTemplateUrl($window: ng.IWindowService, templateRelativeUrl): string {
		return $window.location.origin + $window.location.pathname.toLowerCase().replace("powerbiviewer.html", "") + templateRelativeUrl;
	}

	function buildTileUrl(pbi: PowerBiViewer.Services.IPowerBiConfig): string {
		var isId = (typeof pbi.dashboardId !== "undefined") && (typeof pbi.tileId !== "undefined");

		if (!isId && (typeof pbi.dashboardName === "undefined" || typeof pbi.tileName === "undefined")) {
			return "/configerror";
		}

		return '/tile/' + isId + '/' +
		       (isId ? pbi.dashboardId : pbi.dashboardName) + '/' +
		       (isId ? pbi.tileId : pbi.tileName);
	}

	function buildReportUrl(pbi: PowerBiViewer.Services.IPowerBiConfig): string {
		var isId = typeof pbi.reportId !== "undefined";

		if (!isId && typeof pbi.reportName === "undefined") {
			return "/configerror";
		}

		return '/report/' + isId + '/' +
		       (isId ? pbi.reportId : pbi.reportName);
	}

	function getRoute($window: ng.IWindowService) {
		var redirectUrl: string = null;

		var config = PowerBiViewer.Services.ConfigService.create($window.location.search);

		switch (config.powerBi.type) {
			case 'tile':
				redirectUrl = buildTileUrl(config.powerBi);
				break;
			case 'report':
				redirectUrl = buildReportUrl(config.powerBi);
				break;
			default:
				redirectUrl = '/configerror';
				break;
		}

		return { redirectTo: redirectUrl };
	}

	function preventCache($httpProvider: ng.IHttpProvider) {
		//initialize get if not there
		if (!$httpProvider.defaults.headers.get) {
			(<any>$httpProvider.defaults.headers).get = {};
		}

		$httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
		// extra
		$httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
		$httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
	}

	function configAdal($httpProvider: ng.IHttpProvider, adalAuthenticationServiceProvider) {
		adalAuthenticationServiceProvider.init(
			{
				tenant: "nordynamics.onmicrosoft.com",
				clientId: "d976555d-531d-4e3a-b277-4cf309b81ab1", // CRM Power BI Viewer
				endpoints: {
					"https://api.powerbi.com": "https://analysis.windows.net/powerbi/api"
				},
				//cacheLocation: 'localStorage' // enable this for IE, as sessionStorage does not work for localhost
				cacheLocation: 'sessionStorage'
			},
			$httpProvider
		);
	}

	function configUrlWhiteList($sceDelegateProvider: ng.ISCEDelegateProvider) {
		$sceDelegateProvider.resourceUrlWhitelist([
			'self',
			'https://*.crm4.dynamics.com/**',
			'https://*.powerbi.com/**'
		]);
	}
}