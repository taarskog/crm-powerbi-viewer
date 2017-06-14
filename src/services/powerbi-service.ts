import { XhrClient, RequestMethods, XhrRequestError } from "./xhrClient";

export interface IdModel {
    id: string;
}

export interface EmbeddableModel extends IdModel {
    embedUrl: string;
}

export interface GroupModel extends IdModel {
    name: string;
    isReadOnly: boolean;
}

export interface ReportModel extends EmbeddableModel {
    name: string;
    webUrl: string;
    isOriginalPbixReport: boolean;
    isOwnedByMe: boolean;
    modelId: number;
}

export interface DashboardModel extends EmbeddableModel {
    displayName: string;
    isReadOnly: boolean;
}

export interface TileModel extends EmbeddableModel {
    title: string;
    subTitle: string;
    colSpan: number;
    rowSpan: number;
}

export class Client {
    private static get baseUri() { return "https://api.powerbi.com/v1.0/"; }

    private static getDataAsJson(token: string, url: string): Promise<any> {
        return XhrClient.send({
            method: RequestMethods.Get,
            url: url,
            headers: { "Authorization": `Bearer ${token}` }
        }).then(response => {
            return JSON.parse(response);
        });
    }

    public static getAllGroupsForCurrentUser(token: string): Promise<GroupModel[]> {
        return Client.getDataAsJson(token, this.baseUri + "myorg/groups").then(response => { return <GroupModel[]>response.value; });
    }

    public static getAllTilesInDashboard(token: string, dashboardId: string, groupId: string = null): Promise<TileModel[]> {
        return Client.getDataAsJson(token, this.baseUri + `myorg${this.getGroupString(groupId)}/dashboards/${dashboardId}/tiles`).then(response => { return <TileModel[]>response.value; });
    }

    public static getAllReports(token: string, groupId: string = null): Promise<ReportModel[]> {
        return Client.getDataAsJson(token, this.baseUri + `myorg${this.getGroupString(groupId)}/reports`).then(response => { return <ReportModel[]>response.value; });
    }

    public static getAllDashboards(token: string, groupId: string = null): Promise<DashboardModel[]> {
        return Client.getDataAsJson(token, this.baseUri + `myorg${this.getGroupString(groupId)}/dashboards`).then(response => { return <DashboardModel[]>response.value; });
    }

    private static getGroupString(groupId: string = null): string {
        return groupId == null ? "" : "/groups/" + groupId;
    }
}