module PowerBiViewer.Config.UrlWhitelistConfig {

	export function configure($sceDelegateProvider: ng.ISCEDelegateProvider) {
		$sceDelegateProvider.resourceUrlWhitelist([
			'self',
			'https://*.dynamics.com/**',
			'https://*.powerbi.com/**'
		]);
	}

	export module configure {
		export const $inject: Array<string> = ['$sceDelegateProvider'];
	}
}