var powerBiViewerConfig: PowerBiViewer.Models.PowerBiAppConfigModel = powerBiViewerConfig || null;

module PowerBiViewer.App {
	if (parent.location.pathname.indexOf("/his_/powerBiViewer.html") >= 0 && parent.location.search.indexOf("data=") >= 0) {
		//In child auth frame
		angular.module('powerBiViewerApp', ['AdalAngular'])
			.constant('IAppConfig', new Config.AppConfig(powerBiViewerConfig))
			.config(Config.AdalConfig.configure)
			.config(Config.UrlWhitelistConfig.configure);
	}
	else {
		// In web resource frame
		angular.module('powerBiViewerApp', ['ngRoute', 'AdalAngular'])
			.constant('IAppConfig', new Config.AppConfig(powerBiViewerConfig))
			.constant('IViewConfig', new Config.ViewConfig(window.location.search))
			.constant('XrmStatic', typeof parent.Xrm === "undefined" ? null : parent.Xrm)
			.service('IPowerBiService', PowerBiViewer.Services.PowerBiService)
			.service('IFilterService', PowerBiViewer.Services.FilterService)
			.service('IAuthService', PowerBiViewer.Services.AuthService)
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
}