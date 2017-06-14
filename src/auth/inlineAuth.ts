import AuthBase from "./authBase";
import log from "../diag/logger";
import {LoginEventData} from "./eventData";

/**
 * Inline authentication (for Dynamics 365 Online)
 * @extends {AuthBase}
 */
export default class InlineAuth extends AuthBase {
    constructor() {
        super();
        this.init();

        if (this.loginInProgress && this.isContentFrame && this.isCallback) {
            // Notify waiting parties that login has completed
            log.debug(`Login callback - notifying other parties... Result: '${this.authFailedMessage}'`);
            this.loginInProgress = false;
            window.top.postMessage(new LoginEventData(this.authFailedMessage), window.location.origin);
        }
    }
}