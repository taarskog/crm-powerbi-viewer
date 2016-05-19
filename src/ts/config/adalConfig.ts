var Logging = Logging || {};

module PowerBiViewer.Config.AdalConfig {

	export function configure($httpProvider: ng.IHttpProvider, adalAuthenticationServiceProvider, appConfig: Config.IAppConfig) {
		var config = appConfig.config;

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
				anonymousEndpoints: [
					".dynamics.com"
				]
			},
			$httpProvider
		);
	}

	export module configure {
		export const $inject: Array<string> = ['$httpProvider', 'adalAuthenticationServiceProvider', 'IAppConfig'];

	}
}

// Hack to prevent sending token when getting CRM-files.
// This code disables the check made by adal.js in getResourceForEndpoint() where App will use idtoken for calls to itself.
var AuthenticationContext = AuthenticationContext || {};
AuthenticationContext.prototype._getHostFromUri = function (uri) {
	this.his_counter = (typeof this.his_counter === "undefined") ? 1 : this.his_counter + 1;
	return this.his_counter;
};
