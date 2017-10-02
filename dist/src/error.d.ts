/// <reference types="verror" />
import { VError, Info } from 'verror';
export declare const enum ErrorName {
    CLIENT_ERROR = "esi:ClientError",
    FORBIDDEN_ERROR = "esi:ForbiddenError",
    NOT_FOUND_ERROR = "esi:NotFoundError",
    INTERNAL_SERVER_ERROR = "esi:InternalServerError",
    IO_ERROR = "esi:IOError",
    GENERIC_ERROR = "esi:Error",
}
export declare class ESIError extends VError {
    readonly kind: ErrorName;
    constructor(kind: ErrorName, causeOrInfo: Error | Info, formatString: string, ...formatArgs: any[]);
    constructor(kind: ErrorName, info: Info, cause: Error, formatString: string, ...formatArgs: any[]);
    constructor(kind: ErrorName, formatString: string, ...formatArgs: any[]);
    readonly info: Info;
    readonly fullStack: string;
    toString(): string;
}
export declare function isESIError(error: Error, kind?: ErrorName): error is ESIError;
