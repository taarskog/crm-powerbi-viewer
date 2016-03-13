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
			enableHttpCache: true
		};

		constructor(config: Models.PowerBiAppConfigModel) {
			this.config = config;
			this.setDefaults();
			this.validate();
		}

		/**
		 * Set defaults of values not set in prvided configuration.
		 */
		private setDefaults():void {
			if (typeof this.config === "undefined" || this.config === null) {
				this.config = AppConfig.powerBiViewerConfigDefaults;
			}

			if (typeof powerBiViewerConfig.tenant === "undefined") {
				powerBiViewerConfig.tenant = AppConfig.powerBiViewerConfigDefaults.tenant
			}

			if (typeof powerBiViewerConfig.clientId === "undefined") {
				powerBiViewerConfig.clientId = AppConfig.powerBiViewerConfigDefaults.clientId
			}

			if (typeof powerBiViewerConfig.tokenCacheLocation === "undefined") {
				powerBiViewerConfig.tokenCacheLocation = AppConfig.powerBiViewerConfigDefaults.tokenCacheLocation
			}

			if (typeof powerBiViewerConfig.enableHttpCache === "undefined") {
				powerBiViewerConfig.enableHttpCache = AppConfig.powerBiViewerConfigDefaults.enableHttpCache
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

			this.isValid = state;
		}
	}
}