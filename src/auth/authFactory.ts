import AuthBase from "./authBase";
import InlineAuth from "./inlineAuth";
import PopupAuth from "./popupAuth";

export default class AuthFactory {
    static create(isOnline: boolean): AuthBase {
        return isOnline ? new InlineAuth() : new PopupAuth();
    }
}