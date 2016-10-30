module PowerBiViewer.Config.UrlWhitelistConfig {

	export function configure($sceDelegateProvider: ng.ISCEDelegateProvider, appConfig: Config.IAppConfig) {
		let whitelist = appConfig.config.urlWhitelist;
		whitelist.push(
			'self',
			'https://*.dynamics.com/**',
			'https://*.powerbi.com/**'
		);

		$sceDelegateProvider.resourceUrlWhitelist(whitelist);
	}

	export module configure {
		export const $inject: Array<string> = ['$sceDelegateProvider', 'IAppConfig'];
	}
}