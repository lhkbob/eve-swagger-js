"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const verror_1 = require("verror");
var ErrorName;
(function (ErrorName) {
    ErrorName["CLIENT_ERROR"] = "esi:ClientError";
    ErrorName["FORBIDDEN_ERROR"] = "esi:ForbiddenError";
    ErrorName["NOT_FOUND_ERROR"] = "esi:NotFoundError";
    ErrorName["INTERNAL_SERVER_ERROR"] = "esi:InternalServerError";
    ErrorName["IO_ERROR"] = "esi:IOError";
    ErrorName["GENERIC_ERROR"] = "esi:Error";
})(ErrorName = exports.ErrorName || (exports.ErrorName = {}));
class ESIError extends verror_1.VError {
    constructor(kind, ...args) {
        let cause;
        let info;
        let formatString;
        let formatArgs;
        if (typeof args[0] === 'string') {
            // Third constructor variant with just a message and sprintf args
            formatString = args[0];
            formatArgs = args.slice(1);
        }
        else if (args[0] instanceof Error) {
            // First constructor variant that takes an Info or a cause, and is
            // disambiguated in this case to just a cause and then message
            cause = args[0];
            formatString = args[1];
            formatArgs = args.slice(2);
        }
        else {
            // First or second constructor that takes an Info object, if it's not
            // undefined and not an Error then it is assumed to be an info object. -
            // The types of the argument ensure it won't be undefined
            info = args[0];
            // Disambiguate first and second variants
            if (typeof args[1] === 'string') {
                formatString = args[1];
                formatArgs = args.slice(2);
            }
            else {
                cause = args[1];
                formatString = args[2];
                formatArgs = args.slice(3);
            }
        }
        // The typing definition in Info is incorrect, the constructorOpt value gets
        // passed directly into Error.captureStackTrace(), which takes a generic
        // Function, not a void function (which doesn't make sense given it's meant
        // to be a constructor).
        let ctor = ESIError.constructor;
        super({
            name: kind,
            cause: cause,
            strict: true,
            info: info,
            constructorOpt: ctor
        }, formatString, ...formatArgs);
        this.kind = kind;
    }
    get info() {
        return verror_1.VError.info(this);
    }
    get fullStack() {
        return verror_1.VError.fullStack(this);
    }
    toString() {
        return this.fullStack;
    }
}
exports.ESIError = ESIError;
function isESIError(error, kind) {
    if (kind) {
        // Check for the specific name in the error chain
        if (error instanceof ESIError) {
            return error.kind === kind;
        }
        else {
            return verror_1.VError.hasCauseWithName(error, kind);
        }
    }
    else {
        // Check every possible defined name for ESI errors
        // -TS doesn't seem to let you iterate over values within a const enum :/
        return isESIError(error, "esi:ClientError" /* CLIENT_ERROR */) || isESIError(error, "esi:ForbiddenError" /* FORBIDDEN_ERROR */) || isESIError(error, "esi:Error" /* GENERIC_ERROR */) || isESIError(error, "esi:InternalServerError" /* INTERNAL_SERVER_ERROR */) || isESIError(error, "esi:IOError" /* IO_ERROR */) || isESIError(error, "esi:NotFoundError" /* NOT_FOUND_ERROR */);
    }
}
exports.isESIError = isESIError;
//# sourceMappingURL=error.js.map