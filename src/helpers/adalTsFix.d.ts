// Quick fix for lacking defs in adal-angular...

import { default as tempAuthContext, AuthenticationContextOptions, UserInfo, LoggingLevel as tempLoggingLevel } from "adal-angular";

interface AuthContextFix extends tempAuthContext {
    config: AuthenticationContextOptions;
}

export interface Logging {
    level: any;
    log(message): void;
}

export interface AuthenticationContext extends AuthContextFix { }

export interface Config extends AuthenticationContextOptions { }

export interface User extends UserInfo { }

export enum LoggingLevel {}

