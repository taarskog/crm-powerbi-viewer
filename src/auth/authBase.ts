// import * as adal from "../helpers/adalTsFix";
// import * as adal from "adal-angular";
import AuthenticationContext from "adal-angular";
import appConfig from "../config/appConfig";
import log from "../diag/logger";
import { LoginEventData } from "./eventData";
import pbia from "../diag/analytics";

interface IXrmWindow extends Window {
    pbiViewer: {
        loginInProgress: boolean;
    };
}

interface IAuthWindow extends Window {
    parent: IAuthWindow;
    top: IXrmWindow;
    auth_master: boolean;
    Logging: AuthenticationContext.LoggingConfig;
}

let authWindow = <IAuthWindow><unknown>window;
authWindow.top.pbiViewer = authWindow.top.pbiViewer || { loginInProgress: false };

abstract class AuthBase {

    private _isAuthCallback: boolean = false;
    private _authError: string = null;

    private _tokenExpire: number;
    private _tokenExpireNotified: boolean = false;
    private _tokenExpirationTimerId: number = null;

    protected adalConfig: AuthenticationContext.Options;
    protected _adalContext: AuthenticationContext = null;

    /** Callback to notify that a token is about to expire. Thus probably needs to be refreshed. Called X ms prior to expiration per offset set in appConfig. */
    public authAboutToExpireCallback: VoidFunction;

    /**
     * True if code is executing in the content frame; otherwise false.
     * @description Page logic should take place in the content frame. If false, page logic should be aborted as the frame is for authentication only.
     */
    public get isContentFrame(): boolean { return window.top !== window.self && (typeof (authWindow.parent.auth_master) === "undefined" || authWindow.parent.auth_master === false); }

    /**
     * True if code is executing in a hidden helper frame or auth popup window.
     * @description If true, page logic should be aborted as the frame is for authentication only.
     */
    public get isAuthFrame(): boolean { return !this.isContentFrame; }

    /**
     * True if processing an auth response.
     * @description We have an auth response if the URL fragment (hash) contains access token, id token or error_description
     */
    public get isCallback(): boolean { return this._isAuthCallback; }

    /** True if authentication failed (i.e. callback returned an error) */
    public get authFailed(): boolean { return this._authError && this._authError.length > 0; }

    /** Authentication error message from callback */
    public get authFailedMessage(): string { return this._authError; }

    /** True if login is in progress by this or any other frame on the page. */
    protected get loginInProgress(): boolean { return authWindow.top.pbiViewer.loginInProgress; }

    /** Set true when initiating login to prevent other frames from also initiating a login (they should wait for a window message with LoginEventData) */
    protected set loginInProgress(value: boolean) { authWindow.top.pbiViewer.loginInProgress = value; }

    /** Creates an instance of AuthBase. */
    protected constructor() {
        // Set state so child frames can identify that their purpose is to support auth and not provide UI (pages with visible content are auth_masters).
        authWindow.auth_master = this.isContentFrame;

        // Set Adal logging
        authWindow.Logging.level = appConfig.auth_log_level;
        authWindow.Logging.log = appConfig.auth_log_fn;

        // Set initial adal config (may be overridden in child class)
        this.adalConfig = {
            tenant: appConfig.auth_tenant,
            instance: appConfig.auth_ad_instance,
            clientId: appConfig.auth_client_id,
            expireOffsetSeconds: appConfig.auth_expire_offset,
            cacheLocation: appConfig.auth_cache_location,
            extraQueryParameter: appConfig.auth_extraQueryParameter,
            navigateToLoginRequestUrl: true,
            popUp: false,
            displayCall: null,
            redirectUri: window.location.href
        };
    }

    /**
     * Get Power BI access token. If required it initiates login to get a valid id token prior to getting the access token.
     * @returns {Promise<string>} The access token to Power BI
     */
    public getToken(): Promise<string> {
        return this.getUser().then(user => { pbia.setUser(user); return this.getAccessToken(appConfig.auth_powerbi_resource_uri); });   // Getting user first to ensure the adal user object is initialized
    }

    /** Initialize Auth. Must be called in the constructor of classes that extend this class. Changes to properties in adalConfig should be performed prior to calling init. */
    protected init() {
        // Initialize Adal
        this._adalContext = <AuthenticationContext>new AuthenticationContext(this.adalConfig);

        // Handle auth response
        this._isAuthCallback = this._adalContext.isCallback(window.location.hash);
        if (this._isAuthCallback) {
            log.debug("Handling callback (in constructor).");
            this.handleAuthCallback();
        }
    }

    /**
     * Get details on logged in user. Initialize login if no user data is available and loginIfRequired is true (default).
     * @param {boolean} [loginIfRequired=true] Initiate login if user data not available.
     * @returns {Promise<adal.User>} User details.
     */
    public getUser(loginIfRequired: boolean = true): Promise<AuthenticationContext.UserInfo> {
        let user = this._adalContext.getCachedUser();
        if (user && user.userName.length > 0) {
            log.info(`Logged in to Power BI as '${user.userName}'`);
            return Promise.resolve(user);
        }
        else if (loginIfRequired) {
            log.info("Seems to not be logged in to Azure AD. Initiating login...");
            return this.initiateLogin().then(() => this._adalContext.getCachedUser());
        }
        else {
            return Promise.reject(new Error("Not logged in."));
        }
    }

    /**
     * Parse the auth response (extract and store the received token).
     * @param {string} [hash=window.location.hash] Hash containing the STS response.
     */
    protected handleAuthCallback(hash: string = window.location.hash) {
        // Let adal handle callback results from STS (getting access token, parsing error details, etc.).
        (<any>this._adalContext).handleWindowCallback(hash);

        if ((this._authError = this._adalContext.getLoginError())) {
            pbia.auth("Failed in callback", this.authFailedMessage);
            log.error(`Auth failed. Message: '${this.authFailedMessage}'`);
        }
    }

    /**
     * Get access token for resource.
     * @description Adal handle the process and will first try to get token from cache, then from STS. If required, login is automatically initiated.
     * @param {string} resource Resource to acquire token for.
     * @param {boolean} [retry=true] Internal field - do not provide a value here - intention is to prevent an infinite loop when login fail.
     * @returns {Promise<string>} The Access Token.
     */
    private getAccessToken(resource: string, retry: boolean = true): Promise<string> {
        return new Promise((resolve, reject) => {
            this._adalContext.acquireToken(resource, (errorDesc: string, accessToken: string, error: string = "") => {
                if (error && error.length > 0) {
                    if (error === "login required" && retry) {
                        log.info("Login required.");
                        this.initiateLogin()
                            .then(() => this.getAccessToken(resource, false)).then(accessToken => {
                                if (this.loginInProgress) {
                                    // Notify waiting parties that login has completed (and we now also have a cached access token they can use)
                                    pbia.auth("Notify complete", "Login Success");
                                    this.loginInProgress = false;
                                    window.top.postMessage(new LoginEventData(this._authError), window.location.origin);
                                }

                                resolve(accessToken);
                            })
                            .catch(error => {
                                // Login seems to have failed - notify waiting parties
                                if (this.loginInProgress) {
                                    pbia.auth("Notify complete", "Login Failed");
                                    this.loginInProgress = false;
                                    window.top.postMessage(new LoginEventData(error), window.location.origin);
                                }

                                reject(error);
                            });
                    }
                    else {
                        pbia.auth("Token Not Acquired", "Access Token");
                        log.debug(`Failed getting access token => '${errorDesc}'.`);
                        reject(errorDesc);
                    }
                }
                else {
                    log.debug("Access token acquired.");
                    pbia.auth("Token Acquired", "Access Token");
                    this.setExpiration();
                    resolve(accessToken);
                }
            });
        });
    }

    /**
     * Initiate login.
     * @returns {Promise<void>} No data just a promise.
     */
    private initiateLogin(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (this.loginInProgress) {
                log.info("Login already in progress. Waiting for it to complete...");
                pbia.auth("Await Login", "Start");

                // Small hack to handle situations where login is completed before all iframes have had the chance to setup their event listeners
                let isResolved = false;
                let loginPollTimer = window.setInterval(
                    () => {
                        if (!this.loginInProgress) {
                            log.debug("PollTimer identified login complete");
                            window.clearInterval(loginPollTimer);
                            if (!isResolved) {
                                log.info("PollTimer resolving login");
                                isResolved = true;
                                resolve();
                            }
                        }
                    },
                    appConfig.auth_login_polltimer_duration);

                // Listen for login completion from frame that initiated the login.
                window.top.addEventListener("message", function cb(event: MessageEvent<LoginEventData>) {
                    let data: LoginEventData = event.data;
                    log.debug(data);
                    if (data.type === LoginEventData.typeName) {
                        event.currentTarget.removeEventListener(event.type, <EventListenerOrEventListenerObject>cb);   // As IE and Edge do not support options in addEventListener we cannot use once and need to do it the hard way with removeEventListener.

                        pbia.auth("Await Login", "Done");
                        if (!isResolved && data.success) {
                            isResolved = true;
                            log.info("Notified of login success");
                            resolve();
                        }
                        else if (!isResolved) {
                            isResolved = true;
                            log.error("Notified of login failure => " + data.errorDescription);
                            reject(data.errorDescription);
                        }
                    }
                }, false);
            }

            else {
                // Block other frames from initiating login - they should wait for this login...
                this.loginInProgress = true;
                pbia.auth("New Login");
                log.info("Initiating new login...");

                (<any>this._adalContext).callback = (errorDesc: string, idToken: string, error: string) => {
                    // Restore queryParameters as they were before adding login parameters (cannot be there when renewing tokens in hidden iframes).
                    this._adalContext.config.extraQueryParameter = orgQueryParameter;

                    if (error && error.length > 0) {
                        log.error(`Login failed => '${errorDesc}'.`);
                        pbia.auth("Login Failed");
                        this.loginInProgress = false;
                        reject(errorDesc);
                    }
                    else {
                        log.info(`Login success.`);
                        pbia.auth("Login Success");
                        resolve();
                    }
                };

                // Store queryParameter before adding login parameters and initiating login
                let orgQueryParameter = this._adalContext.config.extraQueryParameter;
                this._adalContext.config.extraQueryParameter = ((appConfig.auth_extraQueryParameter == null || appConfig.auth_extraQueryParameter.length === 0) ? "" : appConfig.auth_extraQueryParameter + "&") + appConfig.auth_extraQueryParameter_on_login;
                this._adalContext.login();
            }
        });
    }

    /** Get token expiration time and setup notification */
    private setExpiration(): void {
        let user = this._adalContext.getCachedUser();
        if (user !== null && user.profile !== null) {
            // May also need to verify id token and use clientId to renew if that has expired (now only calling for resource)

            // Hack to get expiration of access token (api only provides for id token)
            let accessTokenExpiration: number = (<any>this._adalContext)._getItem((<any>this._adalContext).CONSTANTS.STORAGE.EXPIRATION_KEY + appConfig.auth_powerbi_resource_uri);
            this._tokenExpire = accessTokenExpiration * 1000;
            log.info(`Access token expires at : ${new Date(this._tokenExpire)}`);

            if (this._tokenExpirationTimerId != null) {
                window.clearTimeout(this._tokenExpirationTimerId);
            }

            this._tokenExpirationTimerId = window.setTimeout(
                () => this.authAboutToExpireCallback && typeof this.authAboutToExpireCallback === "function" && this.authAboutToExpireCallback() !== null && pbia.auth("Expiry Notification", "Access Token"),
                this._tokenExpire - Date.now() - appConfig.auth_token_expire_notification_offset);
        }
    }
}

export default AuthBase;