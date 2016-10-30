module PowerBiViewer.Models {
	export interface PowerBiAppConfigModel {
		tenant?: string;
		clientId: string;
		tokenCacheLocation?: string;
		enableHttpCache?: boolean;
		adalLogLevel?: number;
		adalLogFn?: Function;
		urlWhitelist?: string[];
		anonymousEndpoints?: string[];
		crmOnline?: boolean;
	}
}