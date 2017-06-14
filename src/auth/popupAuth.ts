import appConfig from "../config/appConfig";
import log from "../diag/logger";
import AuthBase from "./authBase";

interface PopupDimension {
    x: number;
    y: number;
    width: number;
    height: number;
}

/**
 * Authentication using a popup dialog (for Dynamics 365 On-premise/hosted environments)
 * @extends {AuthBase}
 */
export default class PopupAuth extends AuthBase {
    private get isPopup() { return this.isAuthFrame && window.top === window.self; }

    constructor() {
        super();

        // Set custom login handling
        this.adalConfig.popUp = true;
        this.adalConfig.displayCall = url => this.open(url);

        this.init();
    }

    private open(url: string): void {
        let popup = window.open(url, "pbiViewerLogin", this.getPopupFeatures());
        if (popup && popup.focus) {
            popup.focus();
        }

        let expectedRedirectUri = window.location.href.replace(window.location.search, "").split("#")[0];

        let pollTimer = window.setInterval(() => {
            if (!popup || popup.closed) {
                log.info("Popup window has beed closed -> Stop waiting for callback.");
                window.clearInterval(pollTimer);
            }

            try {
                if (popup.location.href.indexOf(expectedRedirectUri) !== -1) {
                    window.clearInterval(pollTimer);
                    log.debug("Handling callback from popup => " + popup.location.hash);
                    this.handleAuthCallback(popup.location.hash);
                    log.info("Closing popup window");
                    popup.close();
                }
            }
            catch (e) {
            }
        }, 20);
    }

    private getPopupFeatures(): string {
        let dim = this.getCenteredPopupDimension();
        return `left=${dim.x},top=${dim.y},width=${dim.width},height=${dim.height}`;
    }

    private getCenteredPopupDimension(): PopupDimension {
        // window.innerWidth/Height gets browser window's height and width excluding toolbars
        let width = window.innerWidth;
        let height = window.innerHeight;

        // Using screenX and screenY to account for dual monitors
        let left = ((width / 2) - (appConfig.auth_popup_width / 2)) + window.screenX;
        let top = ((height / 2) - (appConfig.auth_popup_height / 2)) + window.screenY;

        return {
            x: left,
            y: top,
            width: appConfig.auth_popup_width,
            height: appConfig.auth_popup_height
        };
    }
}
