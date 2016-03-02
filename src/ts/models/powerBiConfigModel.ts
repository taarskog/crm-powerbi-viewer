module PowerBiViewer.Models {
	export interface PowerBiConfigModel {
		tenant?: string;
		clientId: string;
		tokenCacheLocation?: string;
		enableHttpCache?: boolean;
	}
}