/**
 * Application configuration (singleton)
 */
class AppConfig {
    private static _instance: AppConfig = null;
    public static get instance() { return this._instance || (this._instance = new this()); }

    /** How to perform authentication - valid values are "inline" or "popup".
     * @description You should typically use "inline" on Dynamics 365 Online with users located in your Azure AD and "popup" when on-premise (might also be required if you have invited external parties to your Azure AD).
     */
    auth_mode = "inline";

    /** Auto-refresh access - may cause page reload if token cannot be updated silently  */
    auto_refresh_token: boolean = true;

    /** Client ID assigned to your app by Azure Active Directory */
    auth_client_id: string = null;

    /** Azure Active Directory Instance. Adal defaults to `https://login.microsoftonline.com/` */
    auth_ad_instance: string = null;

    /** Sets browser storage to either 'localStorage' or sessionStorage'. Adal defaults to 'sessionStorage'. */
    auth_cache_location: string = null;

    /** If the cached token is about to be expired in the expireOffsetSeconds (in seconds), Adal will renew the token instead of using the cached token. Defaults to 120 seconds. */
    auth_expire_offset: number = null;

    /** Target tenant (defaults to common) */
    auth_tenant: string = null;

    /** Resource to request access token for. */
    auth_powerbi_resource_uri: string = "https://analysis.windows.net/powerbi/api";

    /** Extra query parameters to send to AD (remember to properly encode) */
    auth_extraQueryParameter: string = null;

    /** Only added when calling adal.login (basically for testing to input login_hint which cannot be added on renew tokens as we then create a duplicate) */
    auth_extraQueryParameter_on_login: string = null;

    /** How frequent (in ms) to check if ongoing login has completed (this check is a failsafe for frames that fail to catch the event notification) */
    auth_login_polltimer_duration: number = 125;

    /** How long before a token expires (in ms) should consumers be notified */
    auth_token_expire_notification_offset: number = 5000;

    /** Log level to set on the ADAL library */
    auth_log_level: adal.LoggingLevel = 0;

    /** Function called by ADAL to log messages */
    auth_log_fn: (message: string) => void = msg => console.log(`ADAL: ${msg}`);

    /** Width of login popup window */
    auth_popup_width: number = 483;

    /** Height of login popup window */
    auth_popup_height: number = 600;

    /** Log level for Power BI Viewer */
    log_level = 0;

    /** Perform analytics (please note that this is primarily used for two purposes;
     * to measure the stability of the solution, and understand the adoption.
     *
     * IMPORTANT! Continued releases of crm-powerbi-viewer depend on the team seeing that it is in use... Disabling analytics may result in future releases not being made available to the public.
     *            Rather than disabling after reading the documentation, let the team know if you are still concerned about the logging og specific items.
     */
    analytics_enabled = true;

    /** Set true to see what is sent through to analytics - data is logged to the console */
    analytics_local_view = false;

    /** Analytics script url */
    analytics_uri = "https://raw.githubusercontent.com/taarskog/crm-powerbi-viewer/gh-pages/pbia.js";

    /** Seed to use when hashing - djb2 defines 5381 */
    hash_seed = 5381;

    /** Expiry of data stored in local storage (for performance reasons). */
    cache_expiry = 30 * 24 * 60 * 60 * 1000;

    /** Base url when embedding Power BI views */
    embed_base_url: string = "https://app.powerbi.com/";

    /** Array of custom scripts to load. Functions in these scripts can be referenced for report filtering etc. (also see viewConfig) */
    custom_scripts: string[] = [];

    private constructor() {
        this.update();
    }

    /** Update config with data in window.customConfig. */
    update() {
        let customConfig = (<any>window).customConfig = (<any>window).customConfig || {};

        // Allow override of all config values (but prevent all but simple types)
        let customKeys = Object.keys(customConfig);
        customKeys.forEach((key: string) => {
            let keyValue: any = customConfig[key];

            // Ignore null-values - them we use defaults;
            if (keyValue == null) {
                return;
            }

            let keyType = <string>typeof keyValue;
            keyType === "object" && Array.isArray(keyValue) && (keyType = "array");
            switch (keyType) {
                case "string":
                case "number":
                case "boolean":
                case "array":
                    (<any>this)[key] = keyValue;
                    break;
            }
        });
    }
}

// Export singleton instance
let config = AppConfig.instance;
export default config;