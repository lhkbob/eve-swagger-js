"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
const request = require('sync-request');
function isReference(blob) {
    return blob.$ref !== undefined;
}
function isSchema(blob) {
    // A schema will have one of these
    return blob.properties !== undefined || blob.enum !== undefined || blob.items
        !== undefined || blob.type !== undefined;
}
function isEveSSOReference(security) {
    return security.evesso !== undefined;
}
// Implementation functions for constructing and validating dynamic objects
// with the types defined in the spec.
function buildSimpleExample(type, example) {
    // The values in schemaOrType refer to the type names of Swagger types
    if (type === 'string') {
        return typeof example === 'string' ? example : '';
    }
    else if (type === 'integer' || type === 'float' || type === 'number') {
        return typeof example === 'number' ? example : 0;
    }
    else if (type === 'boolean') {
        return typeof example === 'boolean' ? example : false;
    }
    else if (type === 'array') {
        return Array.isArray(example) ? example : [];
    }
    else if (type === 'object') {
        return typeof example === 'object' ? example : {};
    }
    else {
        return null;
    }
}
function buildExampleEnum(schema, example) {
    if (!schema.enum) {
        return 'schema does not represent an enum';
    }
    // If the example value is a valid value for the schema, then return that
    // otherwise return the first value in the enum.
    if (example && validateEnum(schema, example) === '') {
        return example;
    }
    else {
        return schema.enum[0];
    }
}
function buildExampleObject(schema, example) {
    if (!schema.properties) {
        return 'schema does not define properties';
    }
    // This is an object schema, so build examples of all properties and combine
    // them with the value from an example, or embedded example for the prop.
    let finalExample = {};
    for (let p of Object.keys(schema.properties)) {
        let propDef = schema.properties[p];
        let propExample = null;
        if (example) {
            propExample = example[p];
        }
        if (!propExample) {
            // See if we can use embedded example, or the description of the property
            if (propDef.example) {
                propExample = propDef.example['application/json'];
            }
            else {
                propExample = propDef.description;
            }
        }
        finalExample[p] = buildExample(propDef, propExample);
    }
    return finalExample;
}
function buildExampleArray(schema, example) {
    if (!schema.items) {
        return 'schema does not define array item types';
    }
    if (Array.isArray(schema.items)) {
        return 'multi-typed array items are not supported';
    }
    // This is an array, so make an example of an element (or all elements if
    // an example is provided)
    let finalExample = [];
    if (example && example.length > 0) {
        for (let exampleItem of example) {
            finalExample.push(buildExample(schema.items, exampleItem));
        }
    }
    else {
        // No example item, so just add a single default example item
        finalExample.push(buildExample(schema.items));
    }
    return finalExample;
}
function buildExample(schemaOrType, example) {
    if (typeof schemaOrType === 'string') {
        return buildSimpleExample(schemaOrType, example);
    }
    if (isSchema(schemaOrType)) {
        if (schemaOrType.example && !example) {
            example = schemaOrType.example['application/json'];
        }
        if (schemaOrType.properties) {
            return buildExampleObject(schemaOrType, example);
        }
        else if (schemaOrType.items) {
            return buildExampleArray(schemaOrType, example);
        }
        else if (schemaOrType.enum) {
            return buildExampleEnum(schemaOrType, example);
        }
        else if (schemaOrType.type) {
            return buildExample(schemaOrType.type, example);
        }
        else {
            return 'unsupported schema definition: ' + schemaOrType;
        }
    }
    else if (schemaOrType.schema) {
        return buildExample(schemaOrType.schema, example);
    }
    else {
        return 'unsupported schema or type definition: ' + schemaOrType;
    }
}
function validateSimpleType(type, value) {
    // The values in schemaOrType refer to the type names of Swagger types
    if (type === 'string') {
        return typeof value === 'string' ? '' : 'value not a string';
    }
    else if (type === 'integer') {
        return typeof value === 'number' && Math.floor(value) === value ? ''
            : 'value not an integer';
    }
    else if (type === 'float' || type === 'number') {
        return typeof value === 'number' ? '' : 'value not a number';
    }
    else if (type === 'boolean') {
        return typeof value === 'boolean' ? '' : 'value not a boolean';
    }
    else if (type === 'array') {
        return Array.isArray(value) ? '' : 'value not an array';
    }
    else if (type === 'object') {
        return typeof value === 'object' ? '' : 'value not an object';
    }
    else {
        return 'unexpected value type: ' + type;
    }
}
function validateEnum(schema, value) {
    if (!schema.enum) {
        return 'schema does not represent an enum';
    }
    // Check value against allowed set of enums
    let found = false;
    for (let e of schema.enum) {
        if (e === value) {
            found = true;
            break;
        }
    }
    if (!found) {
        return 'value not in enum set: ' + value;
    }
    else {
        // An enum can only have values of strings, numbers, or booleans so
        // the definition should just be a simple type, so the type property
        // better not be undefined.
        return validateSchema(schema.type, value);
    }
}
function validateObject(schema, value) {
    if (typeof value !== 'object') {
        return 'value is not an object';
    }
    if (!schema.properties) {
        return 'schema does not define properties';
    }
    // Validate each property, and make sure the example doesn't have any extras
    // Note that this makes sure the object has all properties defined; it ignores
    // the minimum required set of properties that might be described.
    for (let definedProp of Object.keys(schema.properties)) {
        if (value[definedProp] === undefined) {
            return 'value missing ' + definedProp;
        }
        let propValid = validateSchema(schema.properties[definedProp], value[definedProp]);
        if (propValid !== '') {
            return definedProp + ' fails validation: ' + propValid;
        }
    }
    for (let valueProp of Object.keys(value)) {
        if (schema.properties[valueProp] === undefined) {
            return 'value defines extra ' + valueProp;
        }
    }
    return '';
}
function validateArray(schema, value) {
    if (!schema.items) {
        return 'schema does not define array item types';
    }
    if (Array.isArray(schema.items)) {
        return 'multi-typed array items are not supported';
    }
    if (!Array.isArray(value)) {
        // The collectionFormat member is defined outside the Schema type
        if (schema.collectionFormat === 'pipes') {
            // Ugly special case for handling arrays of arrays (i.e. get_route)
            if (typeof value === 'string' && value.indexOf('|') >= 0) {
                return '';
            }
            else {
                return 'value is not a piped array';
            }
        }
        else {
            return 'value is not an array';
        }
    }
    // Validate each item of the array
    for (let e of value) {
        let elValid = validateSchema(schema.items, e);
        if (elValid !== '') {
            return 'element fails validation: ' + elValid;
        }
    }
    return '';
}
function validateSchema(schemaOrType, value) {
    if (typeof schemaOrType === 'string') {
        return validateSimpleType(schemaOrType, value);
    }
    else if (isSchema(schemaOrType)) {
        if (schemaOrType.properties) {
            return validateObject(schemaOrType, value);
        }
        else if (schemaOrType.items) {
            return validateArray(schemaOrType, value);
        }
        else if (schemaOrType.enum) {
            return validateEnum(schemaOrType, value);
        }
        else if (schemaOrType.type) {
            return validateSchema(schemaOrType.type, value);
        }
        else {
            return 'unsupported schema definition: ' + schemaOrType;
        }
    }
    else if (schemaOrType.schema) {
        return validateSchema(schemaOrType.schema, value);
    }
    else {
        return 'unsupported schema or type definition: ' + schemaOrType;
    }
}
function resolveReferencesInObject(object, refs) {
    // Only process objects and arrays, otherwise it's a primitive so it
    // cannot be a reference type.
    if (Array.isArray(object)) {
        // Resolve each item
        for (let i = 0; i < object.length; i++) {
            if (isReference(object[i])) {
                // Must replace the element directly
                let newV = refs.get(object[i].$ref);
                if (!newV) {
                    throw new Error('Unable to resolve reference: ' + object[i].$ref);
                }
                else {
                    object[i] = newV;
                }
            }
            else {
                // Just recurse
                resolveReferencesInObject(object[i], refs);
            }
        }
        for (let v of object) {
            resolveReferencesInObject(v, refs);
        }
    }
    else if (typeof object == 'object') {
        // Just brute force go through every key recursively, replacing if
        // the current value is a Reference.
        for (let key of Object.keys(object)) {
            let v = object[key];
            if (isReference(v)) {
                // Must replace v
                let newV = refs.get(v.$ref);
                if (!newV) {
                    throw new Error('Unable to resolve reference: ' + v.$ref);
                }
                else {
                    object[key] = v;
                }
            }
            else {
                // Recurse to child property
                resolveReferencesInObject(v, refs);
            }
        }
    }
}
function resolveReferences(spec) {
    // First extract out supported references into Map keyed on their path.
    // Use any as the value type because the different types of values are not
    // compatible and it's assumed that the referrer gets the correct type.
    let refs = new Map();
    if (spec.definitions) {
        // Include each of these as '#/definitions/<name>'
        for (let defName of Object.keys(spec.definitions)) {
            let path = '#/definitions/' + defName;
            refs.set(path, spec.definitions[defName]);
        }
    }
    if (spec.parameters) {
        // Include each of these as '#/parameters/<name>'
        for (let defName of Object.keys(spec.parameters)) {
            let path = '#/parameters/' + defName;
            refs.set(path, spec.parameters[defName]);
        }
    }
    // For simplicity, assume that the pre-defined definitions and parameters
    // do not have their own references; and assume that the only things of
    // interest that might refer to them are the paths.
    resolveReferencesInObject(spec.paths, refs);
}
class Route {
    constructor(api, httpMethod, path, data) {
        this.api = api;
        this.httpMethod = httpMethod;
        this.path = path;
        this.data = data;
        if (!data.operationId) {
            throw new Error('Route does not have an operation id: ' + path);
        }
        this.params = {};
        if (data.parameters) {
            for (let param of data.parameters) {
                this.params[param.name] = param;
            }
        }
        // Extract a 200-ish response code from the responses list
        for (let res of Object.keys(data.responses)) {
            let code = parseInt(res);
            if (code >= 200 && code < 300) {
                // Found the success response
                this.response = data.responses[res];
                this.responseStatus = code;
                break;
            }
        }
        this.description = '';
        let desc = data.description || '';
        for (let part of desc.split('---')) {
            this.description += API.createDescription(part);
        }
        // Assume that the path starts with a slash, so only need to search
        // for the second slash after that.
        let secondSlash = path.indexOf('/', 1);
        this.version = path.substring(1, secondSlash);
    }
    get docURL() {
        if (this.data.tags && this.data.tags.length > 0) {
            return this.api.url + this.api.basePath + '/#!/' + this.data.tags[0] + '/'
                + this.id;
        }
        else {
            return this.api.url + this.api.basePath + '/#!/' + this.id;
        }
    }
    get id() {
        // Presence of operationId is confirmed in the constructor
        return this.data.operationId;
    }
    get tag() {
        if (this.data.tags && this.data.tags.length > 0) {
            return this.data.tags.join('.');
        }
        else {
            return '';
        }
    }
    get parameterNames() {
        return Object.keys(this.params);
    }
    get isTokenRequired() {
        return this.ssoScopes.length > 0;
    }
    get ssoScopes() {
        if (this.data.security) {
            for (let s of this.data.security) {
                if (isEveSSOReference(s)) {
                    return s.evesso;
                }
            }
        }
        return [];
    }
    isQueryParameter(name) {
        return this.parameterSource(name) === 'query';
    }
    isHeaderParameter(name) {
        return this.parameterSource(name) === 'header';
    }
    isBodyParameter(name) {
        return this.parameterSource(name) === 'body';
    }
    isPathParameter(name) {
        return this.parameterSource(name) === 'path';
    }
    parameterSource(name) {
        let data = this.parameterData(name);
        if (data) {
            return data.in;
        }
        else {
            return '';
        }
    }
    parameterData(name) {
        if (name in this.params) {
            return this.params[name];
        }
        else {
            return null;
        }
    }
    isParameterRequired(name) {
        let data = this.parameterData(name);
        if (data && data.required) {
            return true;
        }
        else {
            return false;
        }
    }
    validateParameter(name, value) {
        let data = this.parameterData(name);
        if (data) {
            let status = validateSchema(data, value);
            if (status !== '') {
                // An error, so provide parameter name
                return this.id + ':' + name + '=' + value + ' is invalid: ' + status;
            }
            else {
                return '';
            }
        }
        else {
            return name + ' is not a parameter';
        }
    }
    validateResponse(value) {
        let status = validateSchema(this.response, value);
        if (status !== '') {
            // An error, so provide some extra context in the message
            return this.id + ':response is invalid: ' + status;
        }
        else {
            return '';
        }
    }
    createParameterExample(name) {
        let data = this.parameterData(name);
        if (data) {
            // buildExample will extract an example if it's provided
            return buildExample(data);
        }
        else {
            return null;
        }
    }
    createResponseExample() {
        let example = undefined;
        if (this.response.examples) {
            example = this.response.examples['application/json'];
        }
        return buildExample(this.response, example);
    }
}
exports.Route = Route;
let localApi = null;
let remoteApi = null;
class API {
    constructor(json) {
        // Assume that it is valid and meets the swagger schema
        this.spec = JSON.parse(json);
        resolveReferences(this.spec);
        // Reorder the paths to be an object keyed by operationId
        this.operators = {};
        for (let pathName of Object.keys(this.spec.paths)) {
            let path = this.spec.paths[pathName];
            if (path.get) {
                let route = new Route(this, 'get', pathName, path.get);
                this.operators[route.id] = route;
            }
            if (path.post) {
                let route = new Route(this, 'post', pathName, path.post);
                this.operators[route.id] = route;
            }
            if (path.delete) {
                let route = new Route(this, 'delete', pathName, path.delete);
                this.operators[route.id] = route;
            }
            if (path.put) {
                let route = new Route(this, 'put', pathName, path.put);
                this.operators[route.id] = route;
            }
        }
    }
    get title() {
        return this.spec.info.title;
    }
    get version() {
        return this.spec.info.version;
    }
    get description() {
        return this.spec.info.description || '';
    }
    get basePath() {
        return this.spec.basePath || '';
    }
    get url() {
        return this.schemes[0] + '://' + this.spec.host;
    }
    get swaggerVersion() {
        return this.spec.swagger;
    }
    get contentTypes() {
        return this.spec.produces || [];
    }
    get schemes() {
        return this.spec.schemes || ['http'];
    }
    get isHTTP() {
        if (this.schemes.length === 1) {
            return this.schemes[0] === 'http';
        }
        else {
            return false;
        }
    }
    get isHTTPS() {
        if (this.schemes.length === 1) {
            return this.schemes[0] === 'https';
        }
        else {
            return false;
        }
    }
    get isJSON() {
        return this.contentTypes.length === 1 && this.contentTypes[0]
            === 'application/json';
    }
    get ssoScopes() {
        if (!this.spec.securityDefinitions) {
            return [];
        }
        let sso = this.spec.securityDefinitions['evesso'];
        if (sso.scopes) {
            return Object.keys(sso.scopes);
        }
        else {
            // If sso wasn't actually an EveSSODefinition
            return [];
        }
    }
    get ssoURL() {
        if (!this.spec.securityDefinitions) {
            return '';
        }
        let sso = this.spec.securityDefinitions['evesso'];
        if (sso.authorizationUrl) {
            return sso.authorizationUrl;
        }
        else {
            // If sso wasn't actually an EveSSODefinition
            return '';
        }
    }
    get routeIDs() {
        return Object.keys(this.operators);
    }
    scopeDescription(scope) {
        if (!this.spec.securityDefinitions) {
            return '';
        }
        let sso = this.spec.securityDefinitions['evesso'];
        if (sso.scopes) {
            return sso.scopes[scope] || '';
        }
        else {
            // If sso wasn't actually an EveSSODefinition
            return '';
        }
    }
    route(name) {
        return this.operators[name];
    }
    static createDescription(blob, { makeLowerCase: makeLowerCase = false, punctuate: punctuate = true, removeNewlines: removewNewlines = true } = {}) {
        let desc;
        if (typeof blob === 'string') {
            desc = blob;
        }
        else {
            desc = blob.description || '';
        }
        desc = desc.trim();
        if (desc.length > 0) {
            if (makeLowerCase) {
                // Make lower case
                desc = desc[0].toLowerCase() + desc.substring(1);
            }
            else {
                // Make upper case
                desc = desc[0].toUpperCase() + desc.substring(1);
            }
            if (punctuate) {
                // Check for punctuation at the end and add if necessary
                if (desc[desc.length - 1] !== '.' && desc[desc.length - 1] !== '?'
                    && desc[desc.length - 1] !== '!') {
                    desc += '. ';
                }
            }
            else {
                // Remove punctuation if it exists
                if (desc[desc.length - 1] === '.' || desc[desc.length - 1] === '?'
                    && desc[desc.length - 1] === '!') {
                    desc = desc.substring(0, desc.length - 1);
                }
            }
            if (removewNewlines) {
                desc = desc.replace(/[\n\r]/g, ' ');
            }
            return desc.trim();
        }
        return '';
    }
    static getLocalAPI() {
        if (!localApi) {
            let pathToJSON;
            if (__dirname.endsWith('dist/util')) {
                // This is indicative of the compiled TS running as JS from dist/
                pathToJSON = path.join(__dirname, '../../util/swagger.json');
            }
            else {
                // Actually points to the directory of the TS file
                pathToJSON = path.join(__dirname, './swagger.json');
            }
            localApi = new API(fs.readFileSync(pathToJSON, 'utf8'));
        }
        return localApi;
    }
    static getRemoteAPI() {
        if (!remoteApi) {
            let json = request('get', 'https://esi.evetech.net/_latest/swagger.json');
            remoteApi = new API(json.getBody().toString('utf8'));
        }
        return remoteApi;
    }
}
exports.API = API;
//# sourceMappingURL=esi-api.js.map