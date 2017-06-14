import {LogLevel, default as log} from "./logger";
import pbia from "./analytics";

class EventLog {
    private static _instance: EventLog = null;
    public static get instance() { return this._instance || (this._instance = new this()); }

    private logEvents: boolean = true;
    private eventContainer: HTMLElement = null;

    init(eventContainer: HTMLElement, logEvents: boolean = true) {
        this.logEvents = logEvents;
        this.eventContainer = eventContainer;
        if (this.eventContainer != null) {
            this.eventContainer.innerHTML = "";
        }
    }

    debug(description: string): void {
        this.add(LogLevel.Debug, description);
    }

    info(description: string): void {
        this.add(LogLevel.Info, description);
    }

    warning(description: string): void {
        this.add(LogLevel.Warning, description);
    }

    error(description: string): void {
        this.add(LogLevel.Error, description);
    }

    private add(severity: LogLevel, description: string): void {
        if (this.logEvents) {
            log.log(severity, description);
        }

        if (severity <= LogLevel.Info) {
            pbia.event(severity, description);
        }

        if (this.eventContainer == null) {
            return;
        }

        let el = document.createElement("div");
        el.innerHTML = `<div class="mark">&nbsp;</div><div class="desc">${description}</div>`;
        el.className = "event level" + severity;
        this.eventContainer.appendChild(el);
    }
}

let eventLog = EventLog.instance;
export default eventLog;