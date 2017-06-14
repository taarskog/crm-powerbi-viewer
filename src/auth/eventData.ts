/** Abstract base class for messages posted to any window */
abstract class BaseEventData {
    type: string;
    protected constructor(type: string) {
        this.type = type;
    }
}

/**
 * Event posted to top frame when login has completed.
 * @extends {BaseEventData}
 */
export class LoginEventData extends BaseEventData {
    public static get typeName(): string { return "login"; }

    success: boolean;
    errorDescription: string;

    constructor(errorDescription: string = null) {
        super(LoginEventData.typeName);
        this.errorDescription = errorDescription;
        this.success = this.errorDescription == null || this.errorDescription.length === 0;
    }
}