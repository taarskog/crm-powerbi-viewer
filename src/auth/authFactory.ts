import AuthBase from "./authBase";
import InlineAuth from "./inlineAuth";
import PopupAuth from "./popupAuth";

export default class AuthFactory {
    static create(mode: string): AuthBase {
        switch (mode.toLowerCase()) {
            case "inline":
                return new InlineAuth();
            case "popup":
                return new PopupAuth();
        }

        throw Error("Unsupported authentication mode => " + mode);
    }
}