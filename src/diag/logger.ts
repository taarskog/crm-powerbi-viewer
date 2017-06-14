import appConfig from "../config/appConfig";

export enum LogLevel {
    Error,
    Warning,
    Info,
    Debug
}

class Logger {
    private static _instance: Logger = null;
    public static get instance() { return this._instance || (this._instance = new this()); }

    private logLevel: LogLevel = LogLevel.Warning;

    setLogLevel(level: LogLevel) {
        this.logLevel = level;
    }

    debug(description: any): void { this.log(LogLevel.Debug, description); }
    info(description: any): void { this.log(LogLevel.Info, description); }
    warning(description: any): void { this.log(LogLevel.Warning, description); }
    error(description: any): void { this.log(LogLevel.Error, description); }

    log(severity: LogLevel, description: any): void {
        if (severity > this.logLevel || console == null) {
            return;
        }

        let message = description;
        if (typeof description === "string") {
            message = `[${window.name}] ${description}`;
        }

        switch (severity) {
            case LogLevel.Debug: console.debug && console.debug(message); break;
            case LogLevel.Info: console.info && console.info(message); break;
            case LogLevel.Warning: console.warn && console.warn(message); break;
            case LogLevel.Error: console.error && console.error(message); break;
            default: console.log && console.log(message);
        }
    }
}

let logger = Logger.instance;
// Not best practice to import appConfig but needed for now to get early logs
logger.setLogLevel(appConfig.log_level);
export default logger;