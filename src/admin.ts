import log from "./diag/logger";
import eventLog from "./diag/eventLog";
import pbia from "./diag/analytics";
import AuthBase from "./auth/authBase";
import * as PbiService from "./services/powerbi-service";
import * as Handlebars from "handlebars";
import Clipboard from "clipboard";
import AppBase from "./appBase";

interface DashboardModelExt extends PbiService.DashboardModel {
    tiles: PbiService.TileModel[];
}

interface GroupInfo {
    group: PbiService.GroupModel;
    dashboards: DashboardModelExt[];
    reports: PbiService.ReportModel[];
}

interface ViewModel {
    groups: GroupInfo[];
}

let vm: ViewModel = {
    groups: [
        {
            group: {
                name: "Personal",
                id: null,
                isReadOnly: false
            },
            dashboards: [],
            reports: []
        }
    ]
};

class PowerBiViewerAdminApp extends AppBase {
    constructor() {
        super();
    }

    protected init(auth: AuthBase) {
        pbia.view("admin");
        pbia.setEnv();

        auth.getToken()
            .then(token => this.buildViewModel(token))
            .catch(reason => {
                eventLog.error("Auth error: " + reason);
                this.setError();
            });
    }

    private buildViewModel(token: string) {
        Promise.all([
            // Personal
            this.addReports(token, vm.groups[0]),
            this.addDashboards(token, vm.groups[0]),
            // Group
            this.addGroups(token)])
            .then(() => this.buildUi())
            .catch(reason => {
                eventLog.error(`${reason.status}: ${reason.statusText} - ${reason.name}: ${reason.message}`);
                log.error(reason);
            });
    }

    private buildUi() {
        this.registerHandlebarHelpers();
        let dataContainer = document.getElementById("data-container");
        let template = Handlebars.compile(dataContainer.innerHTML);

        let data = template(vm);
        dataContainer.innerHTML = data;

        let clipboard = new (<any>Clipboard)(".copy-action");
        clipboard.on("error", e => {
            pbia.admin("Copy to clipboard", "Error");
            log.error("Unable to copy view configuration to the clipboard.");
        });
        clipboard.on("success", e => {
            pbia.admin("Copy to clipboard", "Success");
            log.debug("View configuration successfully copied to the clipboard.");
            e.clearSelection();
        });

        dataContainer.style.visibility = "visible";
    }

    private registerHandlebarHelpers() {
        Handlebars.registerHelper({
            crmdata: (pbiType: string, group: PbiService.GroupModel = null, dashboard: PbiService.DashboardModel = null, opt: any) => {
                // Note: Need to take get this and arguments using eval as the TS compiler override their values in this callback and thus can't be referenced directly.
                // tslint:disable:no-eval
                let that = eval("this");
                let args = eval("arguments");
                // tslint:enable:no-eval
                return this.getCrmDataQueryForItem(
                    pbiType,
                    that,
                    (args.length > 2 ? group : null),    // Handlebars append opt at the end - thus num args vary
                    (args.length > 3 ? dashboard : null) // Handlebars append opt at the end - thus num args vary
                );
            },

            previewquery: (pbiType: string, group: PbiService.GroupModel = null, dashboard: PbiService.DashboardModel = null, opt: any) => {
                // Note: Need to take get this and arguments using eval as the TS compiler override their values in this callback and thus can't be referenced directly.
                // tslint:disable:no-eval
                let that = eval("this");
                let args = eval("arguments");
                // tslint:enable:no-eval
                let crmData = this.getCrmDataQueryForItem(
                    pbiType,
                    that,
                    (args.length > 2 ? group : null),    // Handlebars append opt at the end - thus num args vary
                    (args.length > 3 ? dashboard : null) // Handlebars append opt at the end - thus num args vary
                );

                return `data=${encodeURIComponent(crmData)}`;
            }
        });
    }

    private getCrmDataQueryForItem(pbiType: string, item: PbiService.EmbeddableModel, group: PbiService.GroupModel = null, dashboard: PbiService.DashboardModel = null) {
        let groupPart = group == null || group.id == null ? "" : `&groupId=${group.id}`;
        let dashboardPart = dashboard == null ? "" : `&dashboardId=${dashboard.id}`;
        let q = `type=${pbiType}&id=${item.id}${dashboardPart}${groupPart}`;
        if (pbiType.toLowerCase() === "report") {
            q += "&pageName=&showFilterPane=true&showNavPane=true";
        }

        return q;
    }

    private addGroups(token: string): Promise<void[]> {
        return PbiService.Client.getAllGroupsForCurrentUser(token)
            .then(response => {
                let promises = [];
                response.forEach(group => {
                    let idx = vm.groups.push({
                        dashboards: [],
                        group: group,
                        reports: []
                    }) - 1;
                    let grpInfo = vm.groups[idx];

                    promises.push(this.addDashboards(token, grpInfo));
                    promises.push(this.addReports(token, grpInfo));
                });

                return Promise.all(promises);
            });
    }

    private addReports(token: string, grpInfo: GroupInfo): Promise<void> {
        return PbiService.Client.getAllReports(token, grpInfo.group.id)
            .then(response => { grpInfo.reports = response; });
    }

    private addDashboards(token: string, grpInfo: GroupInfo): Promise<void> {
        return PbiService.Client.getAllDashboards(token, grpInfo.group.id)
            .then(response => {
                let promises: Promise<any>[] = [];
                response.forEach((dashboard: DashboardModelExt) => {
                    promises.push(this.addDashboardTiles(token, dashboard.id, grpInfo.group.id)
                        .then(tiles => {
                            dashboard.tiles = tiles;
                            grpInfo.dashboards.push(dashboard);
                            return;
                        }));
                });
                return Promise.all(promises).then(() => { });
            });
    }

    private addDashboardTiles(token: string, dashboardId: string, groupId: string = null): Promise<PbiService.TileModel[]> {
        return PbiService.Client.getAllTilesInDashboard(token, dashboardId, groupId).then(response => response);
    }
}

// Let's get started
new PowerBiViewerAdminApp().start();