import { XhrClient, RequestMethods, XhrRequestError } from "../services/xhrClient";
import {LogLevel, default as log } from "./logger";
import appConfig from "../config/appConfig";
import hash from "../helpers/hash";
import fileCache from "../services/fileCache";

interface Event {
    category: string;
    action: string;
    value?: string;
}

export class Analytics {
    private static _instance: Analytics = null;
    public static get instance() { return this._instance || (this._instance = new this()); }

    private events: Event[] = [];

    constructor() {
        (<any>window).pbia = this.events;
        (<any>window).pbiaLocal = appConfig.analytics_local_view;

        if (appConfig.analytics_enabled) {
            this.loadScript();
        }
        else {
            log.warning("Continued releases of crm-powerbi-viewer depend on the team seeing that it is in use... Blocking analytics may result in future releases not being made available to the public.");
        }
    }

    event(level: LogLevel, description: string) {
        this.post("Event", level.toString(), description);
    }

    view(type: string, preview: boolean = false) {
        this.post("View", type, preview ? "preview" : null);
    }

    auth(action: string, value: string = null) {
        this.post("Auth", action, value);
    }

    admin(action: string, value: string = null) {
        this.post("Admin", action, value);
    }

    setUser(user: adal.User) {
        this.post("Auth", "setUser", hash(user.userName));
        this.post("User", "lcid", parent.Xrm.Page.context.getUserLcid().toString());
        this.post("User", "client type", parent.Xrm.Page.context.client.getClient());
        this.post("Server", "setEnv", hash(location.origin + parent.Xrm.Page.context.getOrgUniqueName()));
        this.post("Server", "server version", parent.Xrm.Page.context.getVersion());
    }

    setEnv() {
        this.env("AuthMode", appConfig.auth_mode);
        this.env("LogLevel", appConfig.log_level.toString());
        this.env("AuthLogLevel", appConfig.auth_log_level.toString());
        this.env("CacheLocation", appConfig.auth_cache_location);
        this.env("AnalyticsLocalView", appConfig.analytics_local_view ? "true" : "false");
    }

    private env(name: string, value: string) {
        this.post("Env", name, value);
    }

    private post(category: string, action: string, value: string = null) {
        this.events.push({
            category: category,
            action: action,
            value: value
        });
    }

    private loadScript(): Promise<void> {
        return fileCache.getData(appConfig.analytics_uri, appConfig.cache_expiry).then(data => {
            let scriptEl = document.createElement("script");
            scriptEl.onload = () => {
                log.debug("Loaded pbia script");
            };

            // No real diff on eval and embedding script thus choosing eval for nicer console logging (only reason really) - kept old code below if we chose to revert
            // tslint:disable-next-line:no-eval
            eval(data);

            // scriptEl.type = "text/javascript";
            // scriptEl.src = "data:text/javascript," + encodeURI(data);
            // document.body.appendChild(scriptEl);
        });
    }
}

let analytics = Analytics.instance;
export default analytics;