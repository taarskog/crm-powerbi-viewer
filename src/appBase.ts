import appConfig from "./config/appConfig";
import log from "./diag/logger";
import eventLog from "./diag/eventLog";
import AuthFactory from "./auth/authFactory";
import AuthBase from "./auth/authBase";

abstract class AppBase {
    protected appStateValid = true;
    private _errorContainerId: string;

    constructor(eventContainerId: string = "event-container", errorContainerId: string = "error-container") {
        this._errorContainerId = errorContainerId;
        log.setLogLevel(appConfig.log_level);
        eventLog.init(document.getElementById(eventContainerId));
        this.validateAppConfig();
    }

    public start(): void {
        if (!this.appStateValid) {
            return;
        }

        let auth = AuthFactory.create(appConfig.auth_mode);

        if (auth.isAuthFrame || auth.isCallback) {
            log.debug("Stopping here as we are in adal auth frame or popup");
        }
        else {
            this.init(auth);
        }
    }

    protected abstract init(auth: AuthBase);

    /**
     * Set app state and notify user that a blocking error has occurred.
     * @param message - information to log to console (not to the UI which will show a std message)
     */
    protected setError(message: any = null): void {
        this.appStateValid = false;
        let errorContainer = document.getElementById(this._errorContainerId);
        errorContainer.style.visibility = "visible";

        if (message != null) {
            log.error(message);
        }
    }

    /** Validate that required info is provided in app config; otherwise log and set app error state. */
    private validateAppConfig(): boolean {
        if (appConfig.auth_client_id == null || appConfig.auth_client_id.length === 0) {
            eventLog.error("Client id not set in config");
            this.setError();
            return false;
        }

        return true;
    }
}

export default AppBase;