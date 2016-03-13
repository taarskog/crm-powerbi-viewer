/// <reference path="directives/ng-onload.ts" />

/// <reference path="models/powerbiappconfigmodel.ts" />
/// <reference path="models/powerbigroupmodel.ts" />
/// <reference path="models/powerbiviewconfigmodel.ts" />
/// <reference path="models/powerbidashboardmodel.ts" />
/// <reference path="models/powerbireportmodel.ts" />
/// <reference path="models/powerbitilemodel.ts" />
/// <reference path="models/powerbidashboardinfomodel.ts" />

/// <reference path="config/urlwhitelistconfig.ts" />
/// <reference path="config/cacheconfig.ts" />
/// <reference path="config/adalconfig.ts" />
/// <reference path="config/appconfig.ts" />
/// <reference path="config/viewconfig.ts" />
/// <reference path="config/routeconfig.ts" />

/// <reference path="services/powerbiservice.ts" />

/// <reference path="controllers/configcontroller.ts" />
/// <reference path="controllers/reportcontroller.ts" />
/// <reference path="controllers/tilecontroller.ts" />

var powerBiViewerConfig: PowerBiViewer.Models.PowerBiAppConfigModel = powerBiViewerConfig || null;

module PowerBiViewer.App {
	angular.module('powerBiViewerApp', ['ngRoute', 'AdalAngular'])
		.constant('IAppConfig', new Config.AppConfig(powerBiViewerConfig))
		.constant('IViewConfig', new Config.ViewConfig(window.location.search))
		.service('IPowerBiService', PowerBiViewer.Config.PowerBiService)
		.directive('ngOnload', Directives.onLoadDirective)
		.controller('ITileController', Controllers.TileController)
		.controller('IReportController', Controllers.ReportController)
		.controller('IConfigController', Controllers.ConfigController)
		.config(Config.RouteConfig.configure)
		.config(Config.CacheConfig.configure)
		.config(Config.AdalConfig.configure)
		.config(Config.UrlWhitelistConfig.configure);
}