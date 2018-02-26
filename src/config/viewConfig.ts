class ViewConfig {
    private static _instance: ViewConfig = null;
    public static get instance() { return this._instance || (this._instance = new this()); }

    query: any = {};
    crmData: any = {};

    /** View type (report, dashboard, tile, visual) */
    get type(): string { return this.crmData.type; }

    /** View id */
    get id(): string { return this.crmData.id; }

    /** Name of visual (only applicable if view type is visual) */
    get visualName(): string { return ViewConfig.getValueOrDefault(this.crmData.visual, null); }

    /** Dashboard id (only applicable if view type is tile) */
    get dashboardId(): string { return ViewConfig.getValueOrDefault(this.crmData.dashboardId, null); }

    /** Group id (not used for personal views) */
    get groupId(): string { return ViewConfig.getValueOrDefault(this.crmData.groupId, null); }

    /** Name of page to show */
    get pageName(): string { return ViewConfig.getValueOrDefault(this.crmData.pageName, ""); }

    /** Show filter pane */
    get showFilterPane(): boolean { return ViewConfig.getValueOrDefault(this.crmData.showFilterPane, true); }

    /** Show navigation pane */
    get showNavPane(): boolean { return ViewConfig.getValueOrDefault(this.crmData.showNavPane, true); }

    /** Function to call when loading a report or dashboard (supports dot-notation) */
    get customFn(): string { return ViewConfig.getValueOrDefault(this.crmData.customFn, null); }

    /** True if this is a preview from the admin page */
    get isPreview(): boolean { return ViewConfig.getValueOrDefault(this.query.preview, false); }

    private constructor() {
        if (window.location.search.length > 1) {
            this.init(window.location.search);
        }
    }

    public init(queryString: string) {
        this.query = ViewConfig.parseQueryString(queryString);
        this.crmData = ViewConfig.parseCrmData(this.query.data == null ? "" : this.query.data);
    }

    private static getValueOrDefault(value: any, defaultValue: any = null): any {
        if (typeof value === "undefined" || value === null) {
            return defaultValue;
        }

        return typeof defaultValue === "boolean" ? (<string>value).toLowerCase() === "true" || value === "1" : value;
    }

    private static parseQueryString(queryString: string): any {
        let query: string = typeof queryString === "undefined" || queryString === null ? "" : queryString;
        query = query.length > 0 && query[0] === "?" ? query.substring(1) : query;
        return ViewConfig.parse(query);
    }

    private static parseCrmData(dataString: string): {} {
        let data: string = decodeURIComponent(dataString);
        return ViewConfig.parse(data);
    }

    private static parse(query: string) {
        let result: any = {};

        let vars: string[] = query.split("&");
        for (let i: number = 0; i < vars.length; i++) {
            let pair: string[] = vars[i].split("=");

            // If first entry with this name
            if (typeof result[pair[0]] === "undefined") {
                result[pair[0]] = pair[1];
            }

            // If second entry with this name
            else if (typeof result[pair[0]] === "string") {
                let arr: any[] = [result[pair[0]], pair[1]];
                result[pair[0]] = arr;
            }

            // If third or later entry with this name
            else {
                result[pair[0]].push(pair[1]);
            }
        }

        return result;
    }
}

let config = ViewConfig.instance;
export default config;
