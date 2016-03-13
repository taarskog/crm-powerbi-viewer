module PowerBiViewer.Config.CacheConfig {
	export function configure($httpProvider: ng.IHttpProvider, appConfig: Config.IAppConfig) {
		if (appConfig.config.enableHttpCache) {
			return;
		}
		else {
			preventCaching($httpProvider);
		}
	}
	export module configure {
		export const $inject: Array < string > = ['$httpProvider', 'IAppConfig'];
	}

	function preventCaching($httpProvider: ng.IHttpProvider) {
		//initialize get if not there
		if (!$httpProvider.defaults.headers.get) {
			(<any>$httpProvider.defaults.headers).get = {};
		}

		$httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
		// extra
		$httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
		$httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
	}
}