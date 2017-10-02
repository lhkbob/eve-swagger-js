import * as swagger from 'swagger-schema-official';
export declare class Route {
    readonly api: API;
    readonly httpMethod: 'get' | 'put' | 'post' | 'delete';
    readonly path: string;
    private data;
    private params;
    readonly response: swagger.Response;
    readonly responseStatus: number;
    readonly description: string;
    readonly version: string;
    constructor(api: API, httpMethod: 'get' | 'put' | 'post' | 'delete', path: string, data: swagger.Operation);
    readonly docURL: string;
    readonly id: string;
    readonly tag: string;
    readonly parameterNames: string[];
    readonly isTokenRequired: boolean;
    readonly ssoScopes: string[];
    isQueryParameter(name: string): boolean;
    isHeaderParameter(name: string): boolean;
    isBodyParameter(name: string): boolean;
    isPathParameter(name: string): boolean;
    parameterSource(name: string): string;
    parameterData(name: string): swagger.Parameter | null;
    isParameterRequired(name: string): boolean;
    validateParameter(name: string, value: any): string;
    validateResponse(value: any): string;
    createParameterExample(name: string): any;
    createResponseExample(): any;
}
export declare class API {
    private spec;
    private operators;
    constructor(json: string);
    readonly title: string;
    readonly version: string;
    readonly description: string;
    readonly basePath: string;
    readonly url: string;
    readonly swaggerVersion: string;
    readonly contentTypes: string[];
    readonly schemes: string[];
    readonly isHTTP: boolean;
    readonly isHTTPS: boolean;
    readonly isJSON: boolean;
    readonly ssoScopes: string[];
    readonly ssoURL: string;
    readonly routeIDs: string[];
    scopeDescription(scope: string): string;
    route(name: string): Route | null;
    static createDescription(blob: {
        description?: string;
    } | string, {makeLowerCase: makeLowerCase, punctuate: punctuate, removeNewlines: removewNewlines}?: {
        makeLowerCase?: boolean;
        punctuate?: boolean;
        removeNewlines?: boolean;
    }): string;
    static getLocalAPI(): API;
    static getRemoteAPI(): API;
}
