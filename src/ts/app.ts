var powerBiViewerConfig: PowerBiViewer.Models.PowerBiAppConfigModel = powerBiViewerConfig || null;

module PowerBiViewer.App {
	angular.module('powerBiViewerApp', ['ngRoute', 'AdalAngular'])
		.constant('IAppConfig', new Config.AppConfig(powerBiViewerConfig))
		.constant('IViewConfig', new Config.ViewConfig(window.location.search))
		.constant('XrmStatic', typeof parent.Xrm === "undefined" ? null : parent.Xrm)
		.service('IPowerBiService', PowerBiViewer.Config.PowerBiService)
		.service('IFilterService', PowerBiViewer.Services.FilterService)
		.directive(Directives.onLoadDirective.name, Directives.onLoadDirective.get)
		.directive(Directives.clipboardDirective.name, Directives.clipboardDirective.get)
		.controller('ITileController', Controllers.TileController)
		.controller('IReportController', Controllers.ReportController)
		.controller('IConfigController', Controllers.ConfigController)
		.config(Config.RouteConfig.configure)
		.config(Config.CacheConfig.configure)
		.config(Config.AdalConfig.configure)
		.config(Config.UrlWhitelistConfig.configure);
}