import { VError, Info } from 'verror';

export const enum ErrorName {
  CLIENT_ERROR = 'esi:ClientError', FORBIDDEN_ERROR = 'esi:ForbiddenError', NOT_FOUND_ERROR = 'esi:NotFoundError', INTERNAL_SERVER_ERROR = 'esi:InternalServerError', IO_ERROR = 'esi:IOError', GENERIC_ERROR = 'esi:Error'
}

export class ESIError extends VError {
  readonly kind: ErrorName;

  constructor(kind: ErrorName, causeOrInfo: Error | Info, formatString: string,
      ...formatArgs: any[]);
  constructor(kind: ErrorName, info: Info, cause: Error, formatString: string,
      ...formatArgs: any[]);
  constructor(kind: ErrorName, formatString: string, ...formatArgs: any[]);
  constructor(kind: ErrorName, ...args: any[]) {
    let cause: Error | undefined;
    let info: Info | undefined;
    let formatString: string;
    let formatArgs: any[];

    if (typeof args[0] === 'string') {
      // Third constructor variant with just a message and sprintf args
      formatString = args[0];
      formatArgs = args.slice(1);
    } else if (args[0] instanceof Error) {
      // First constructor variant that takes an Info or a cause, and is
      // disambiguated in this case to just a cause and then message
      cause = args[0];
      formatString = args[1];
      formatArgs = args.slice(2);
    } else {
      // First or second constructor that takes an Info object, if it's not
      // undefined and not an Error then it is assumed to be an info object. -
      // The types of the argument ensure it won't be undefined
      info = args[0] as Info;
      // Disambiguate first and second variants
      if (typeof args[1] === 'string') {
        formatString = args[1];
        formatArgs = args.slice(2);
      } else {
        cause = args[1];
        formatString = args[2];
        formatArgs = args.slice(3);
      }
    }

    // The typing definition in Info is incorrect, the constructorOpt value gets
    // passed directly into Error.captureStackTrace(), which takes a generic
    // Function, not a void function (which doesn't make sense given it's meant
    // to be a constructor).
    let ctor = <(args: any[]) => void> ESIError.constructor;
    super({
      name: kind,
      cause: cause,
      strict: true,
      info: info,
      constructorOpt: ctor
    }, formatString, ...formatArgs);
    this.kind = kind;
  }

  get info(): Info {
    return VError.info(this);
  }

  get fullStack(): string {
    return VError.fullStack(this);
  }

  toString(): string {
    return this.fullStack;
  }
}

export function isESIError(error: Error, kind?: ErrorName): error is ESIError {
  if (kind) {
    // Check for the specific name in the error chain
    if (error instanceof ESIError) {
      return error.kind === kind;
    } else {
      return VError.hasCauseWithName(error, kind);
    }
  } else {
    // Check every possible defined name for ESI errors
    // -TS doesn't seem to let you iterate over values within a const enum :/
    return isESIError(error, ErrorName.CLIENT_ERROR) || isESIError(error,
            ErrorName.FORBIDDEN_ERROR) || isESIError(error,
            ErrorName.GENERIC_ERROR) || isESIError(error,
            ErrorName.INTERNAL_SERVER_ERROR) || isESIError(error,
            ErrorName.IO_ERROR) || isESIError(error, ErrorName.NOT_FOUND_ERROR);
  }
}
