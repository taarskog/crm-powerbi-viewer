module PowerBiViewer.Models {
	export interface PowerBiGroupModel {
		id: string;
		name: string;

		dashboards: PowerBiDashboardInfoModel[];
	}
}