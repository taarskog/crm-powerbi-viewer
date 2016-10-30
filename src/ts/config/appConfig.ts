module PowerBiViewer.Config {
	export interface IAppConfig {
		config: Models.PowerBiAppConfigModel;
		isValid: boolean;
	}

	export class AppConfig implements IAppConfig {
		config: Models.PowerBiAppConfigModel;
		isValid: boolean;

		private static powerBiViewerConfigDefaults: PowerBiViewer.Models.PowerBiAppConfigModel = {
			tenant: null,
			clientId: null,
			tokenCacheLocation: 'sessionStorage',
			enableHttpCache: true,
			adalLogLevel: 0,
			adalLogFn: msg => console.log(msg),
			urlWhitelist: [],
			anonymousEndpoints: [
				".dynamics.com"
			],
			crmOnline: true
		};

		constructor(config: Models.PowerBiAppConfigModel) {
			this.config = config;
			this.setDefaults();
			this.validate();
		}

		/**
		 * Set defaults of values not set in provided configuration.
		 */
		private setDefaults():void {
			if (typeof this.config === "undefined" || this.config === null) {
				this.config = AppConfig.powerBiViewerConfigDefaults;
			}

			if (typeof powerBiViewerConfig.tenant === "undefined") {
				powerBiViewerConfig.tenant = AppConfig.powerBiViewerConfigDefaults.tenant;
			}

			if (typeof powerBiViewerConfig.clientId === "undefined") {
				powerBiViewerConfig.clientId = AppConfig.powerBiViewerConfigDefaults.clientId;
			}

			if (typeof powerBiViewerConfig.tokenCacheLocation === "undefined") {
				powerBiViewerConfig.tokenCacheLocation = AppConfig.powerBiViewerConfigDefaults.tokenCacheLocation;
			}

			if (typeof powerBiViewerConfig.enableHttpCache === "undefined") {
				powerBiViewerConfig.enableHttpCache = AppConfig.powerBiViewerConfigDefaults.enableHttpCache;
			}

			if (typeof powerBiViewerConfig.adalLogLevel === "undefined") {
				powerBiViewerConfig.adalLogLevel = AppConfig.powerBiViewerConfigDefaults.adalLogLevel;
			}

			if (typeof powerBiViewerConfig.adalLogFn === "undefined") {
				powerBiViewerConfig.adalLogFn = AppConfig.powerBiViewerConfigDefaults.adalLogFn;
			}

			if (typeof powerBiViewerConfig.urlWhitelist === "undefined") {
				powerBiViewerConfig.urlWhitelist = AppConfig.powerBiViewerConfigDefaults.urlWhitelist;
			}

			if (typeof powerBiViewerConfig.anonymousEndpoints === "undefined") {
				powerBiViewerConfig.anonymousEndpoints = AppConfig.powerBiViewerConfigDefaults.anonymousEndpoints;
			}

			if (typeof powerBiViewerConfig.crmOnline === "undefined") {
				powerBiViewerConfig.crmOnline = AppConfig.powerBiViewerConfigDefaults.crmOnline;
			}
		}


		/**
		 * Check that the configuration contains valid values
		 */
		private validate():void {
			var state = true;

			if (powerBiViewerConfig.clientId === null || powerBiViewerConfig.clientId.length === 0) {
				state = false;
			}

			if (!(powerBiViewerConfig.tokenCacheLocation === 'localStorage' || powerBiViewerConfig.tokenCacheLocation === 'sessionStorage')) {
				state = false;
			}

			if (typeof powerBiViewerConfig.enableHttpCache !== "boolean") {
				state = false;
			}

			if (!Array.isArray(powerBiViewerConfig.urlWhitelist)) {
				state = false;
			}

			if (!Array.isArray(powerBiViewerConfig.anonymousEndpoints)) {
				state = false;
			}

			this.isValid = state;
		}
	}
}