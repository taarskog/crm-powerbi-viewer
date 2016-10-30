var Logging = Logging || {};

module PowerBiViewer.Config.AdalConfig {

	export function configure($httpProvider: ng.IHttpProvider, adalAuthenticationServiceProvider, appConfig: Config.IAppConfig, $windowProvider: ng.IServiceProvider) {
		var config = appConfig.config;
		var $window: ng.IWindowService = $windowProvider.$get();

		Logging.level = config.adalLogLevel;
		Logging.log = config.adalLogFn;

		adalAuthenticationServiceProvider.init(
			{
				tenant: config.tenant,
				clientId: config.clientId,
				cacheLocation: config.tokenCacheLocation,
				endpoints: {
					"https://api.powerbi.com": "https://analysis.windows.net/powerbi/api"
				},
				anonymousEndpoints: config.anonymousEndpoints,
				redirectUri: $window.location.href.split('#')[0].split('?')[0],
				displayCall: config.crmOnline ? null : function (urlNavigate) {
					let popupWidth = 483;
					let popupHeight = 600;

					/**
					* adding winLeft and winTop to account for dual monitor
					* using screenLeft and screenTop for IE8 and earlier
					*/
					let winLeft = window.screenLeft ? window.screenLeft : window.screenX;
					let winTop = window.screenTop ? window.screenTop : window.screenY;
					/**
					* window.innerWidth displays browser window's height and width excluding toolbars
					* using document.documentElement.clientWidth for IE8 and earlier
					*/
					let width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
					let height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
					let left = ((width / 2) - (popupWidth / 2)) + winLeft;
					let top = ((height / 2) - (popupHeight / 2)) + winTop;

					var popupWindow = $window.open(urlNavigate, "pbiViewerLogin", `width=${popupWidth}, height=${popupHeight}, top=${top}, left=${left}`);
					if (popupWindow && popupWindow.focus) {
						popupWindow.focus();
					}

					var registeredRedirectUri = this.redirectUri;
					var pollTimer = $window.setInterval(() => {
						if (!popupWindow || popupWindow.closed || popupWindow.closed === undefined) {
							$window.clearInterval(pollTimer);
						}
						try {
							if (popupWindow.document.URL.indexOf(registeredRedirectUri) != -1) {
								$window.clearInterval(pollTimer);
								$window.location.hash = popupWindow.location.hash;
								popupWindow.close();
							}
						} catch (e) {
						}
					}, 20);
				}
			},
			$httpProvider
		);
	}

	export module configure {
		export const $inject: Array<string> = ['$httpProvider', 'adalAuthenticationServiceProvider', 'IAppConfig', '$windowProvider'];

	}
}

// Hack to prevent sending token when getting CRM-files.
// This code disables the check made by adal.js in getResourceForEndpoint() where App will use idtoken for calls to itself.
var AuthenticationContext = AuthenticationContext || {};
AuthenticationContext.prototype._getHostFromUri = function (uri) {
	this.his_counter = (typeof this.his_counter === "undefined") ? 1 : this.his_counter + 1;
	return this.his_counter;
};
