module PowerBiViewer.Config.AdalConfig {

	export function configure($httpProvider: ng.IHttpProvider, adalAuthenticationServiceProvider, appConfig: Config.IAppConfig) {
		var config = appConfig.config;
		adalAuthenticationServiceProvider.init(
			{
				tenant: config.tenant,
				clientId: config.clientId,
				cacheLocation: config.tokenCacheLocation,
				endpoints: {
					"https://api.powerbi.com": "https://analysis.windows.net/powerbi/api"
				}
			},
			$httpProvider
		);
	}

	export module configure {
		export const $inject: Array<string> = ['$httpProvider', 'adalAuthenticationServiceProvider', 'IAppConfig'];

	}
}