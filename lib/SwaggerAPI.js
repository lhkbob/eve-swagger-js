const path = require('path');
const fs = require('fs');

const methods = ['get', 'post', 'put', 'delete'];

function isString(value) {
  return value instanceof String || (typeof value) == 'string';
}

function isNumber(value) {
  return value instanceof Number || (typeof value) == 'number';
}

function isBoolean(value) {
  return value instanceof Boolean || (typeof value) == 'boolean';
}

function isArray(value) {
  return Array.isArray(value);
}

function isObject(value) {
  return (typeof value) == 'object';
}

function buildExample(schemaOrType, providedExample) {
  if (schemaOrType instanceof String || (typeof schemaOrType) == 'string') {
    if (schemaOrType == 'string') {
      return isString(providedExample) ? providedExample : "";
    } else if (schemaOrType == 'integer' || schemaOrType == 'float'
        || schemaOrType == 'number') {
      return isNumber(providedExample) ? providedExample : 0;
    } else if (schemaOrType == 'boolean') {
      return isBoolean(providedExample) ? providedExample : false;
    } else if (schemaOrType == 'array') {
      return isArray(providedExample) ? providedExample : [];
    } else if (schemaOrType == 'object') {
      return isObject(providedExample) ? providedExample : {};
    } else {
      return null;
    }
  } else {
    if (schemaOrType['properties']) {
      // This is an object, so build examples of all properties and combine
      // them
      // (delete any properties from the provided example that aren't actually
      // defined)
      let example = {};
      for (let p of Object.keys(schemaOrType['properties'])) {
        let propDef = schemaOrType['properties'][p];

        let propExample;
        if (providedExample) {
          propExample = providedExample[p];
        }
        if (!providedExample) {
          // See if we can use embedded example, or the description of the
          // property
          if ('examples' in propDef) {
            propExample = propDef['examples']['application/json'];
          } else {
            propExample = propDef['description'];
          }
        }

        example[p] = buildExample(propDef, propExample);
      }

      return example;
    } else if (schemaOrType['items']) {
      // This is an array, so make an example of an element (using the first
      // provided element in the example as an example for that)
      let example = [];
      let providedItemExample;
      if (providedExample && providedExample.length > 0) {
        providedItemExample = providedExample[0];
      }
      example.push(buildExample(schemaOrType['items'], providedItemExample));
      return example;
    } else if (schemaOrType['schema']) {
      return buildExample(schemaOrType['schema'], providedExample);
    } else {
      return buildExample(schemaOrType['type'], providedExample);
    }
  }
}

class Route {
  constructor(api, route) {
    this._api = api;
    this._data = route;

    this._params = {};
    for (let param of route['parameters']) {
      this._params[param['name']] = param;
    }

    // Extract a 200-ish response code from the responses list
    for (let res of Object.keys(route['responses'])) {
      let code = parseInt(res);
      if (code >= 200 && code < 300) {
        // Found the success response
        this._response = route['responses'][res];
        this._response.status = code;
        break;
      }
    }

    let desc = this._data['description'];
    let version = 'v1';
    let mark1 = desc.indexOf('---');
    let mark2 = desc.lastIndexOf('---');
    if (mark1 >= 0) {
      let altBlock = (mark2 > mark1 ? desc.substring(mark1, mark2)
          : desc.substring(mark1));
      let comment = SwaggerAPI.createDescription(desc.substring(0, mark1));
      if (mark2 > mark1) {
        comment += ' ' + SwaggerAPI.createDescription(
                desc.substring(mark2 + 3));
      }
      desc = comment;

      // Try and pull out a version from the list of alternate routes
      for (let r of altBlock.split('\n')) {
        let match = r.match(/Alternate route: `\/(v\d+)\/.+\/`/);
        if (match) {
          version = match[1];
          break;
        }
      }
    }

    this._desc = desc;
    this._version = version;
  }

  _getParameter(name) {
    return this._params[name] || {};
  }

  get api() {
    return this._api;
  }

  get docURL() {
    return this._api.url + this._api.basePath + '/#!/' + this._data['tags'][0]
        + '/' + this.id;
  }

  get id() {
    return this._data['operationId'];
  }

  get path() {
    return this._data['path'];
  }

  get httpMethod() {
    return this._data['method'];
  }

  get description() {
    return this._desc;
  }

  get version() {
    return this._version;
  }

  get parameterNames() {
    return Object.keys(this._params);
  }

  get isTokenRequired() {
    return this.ssoScopes.length > 0;
  }

  get ssoScopes() {
    let security = this._data['security'];
    if (security) {
      for (let s of security) {
        if ('evesso' in s) {
          return s['evesso'];
        }
      }
    }
    return [];
  }

  isQueryParameter(name) {
    return this.parameterSource(name) == 'query';
  }

  isHeaderParameter(name) {
    return this.parameterSource(name) == 'header';
  }

  isBodyParameter(name) {
    return this.parameterSource(name) == 'body';
  }

  isPathParameter(name) {
    return this.parameterSource(name) == 'path';
  }

  parameterSource(name) {
    let data = this._getParameter(name);
    return 'in' in data ? data['in'] : null;
  }

  parameterData(name) {
    let data = this._getParameter(name);
    if (!data) {
      throw new Error('Parameter undefined in ' + this.id + ': ' + name);
    } else {
      return data;
    }
  }

  get responseType() {
    return SwaggerAPI.getJSType(this._response);
  }

  get responseData() {
    return this._response;
  }

  get responseStatus() {
    return this._response['status'];
  }
}

let localApi = null;

class SwaggerAPI {
  constructor(swaggerContents) {
    let json = JSON.parse(swaggerContents);

    this._swaggerVersion = json['swagger'];
    this._schemes = json['schemes'];
    this._contentTypes = json['produces'];
    this._security = json['securityDefinitions'];
    this._host = json['host'];
    this._basePath = json['basePath'];
    this._info = json['info'];

    // Reorder the paths to be an object keyed by operationId, and store the
    // path and method within the returned objects instead of a multi-nested map

    this._operators = {};
    for (let path of Object.keys(json['paths'])) {
      for (let method of Object.keys(json['paths'][path])) {
        if (methods.indexOf(method) < 0) {
          throw new Error("Unexpected method (" + method + ") for " + path);
        }

        let action = Object.assign({}, json['paths'][path][method]);
        action.path = path;
        action.method = method;
        this._operators[action['operationId']] = action;
      }
    }
  }

  get title() {
    return this._info['title'];
  }

  get version() {
    return this._info['version'];
  }

  get description() {
    return this._info['description'];
  }

  get basePath() {
    return this._basePath;
  }

  get url() {
    return this._schemes[0] + '://' + this._host;
  }

  get swaggerVersion() {
    return this._swaggerVersion;
  }

  get contentTypes() {
    return this._contentTypes;
  }

  get isJSON() {
    return this._contentTypes.length == 1 && this._contentTypes[0]
        == 'application/json';
  }

  get ssoScopes() {
    return Object.keys(this._security['evesso']['scopes']);
  }

  get ssoURL() {
    return this._security['evesso']['authorizationUrl'];
  }

  get routeNames() {
    return Object.keys(this._operators);
  }

  scopeDescription(scope) {
    if (!(scope in this._security['evesso']['scopes'])) {
      throw new Error('Scope undefined: ' + scope);
    }

    return this._security['evesso']['scopes'][scope];
  }

  route(name) {
    if (!(name in this._operators)) {
      throw new Error('Route undefined: ' + name);
    }

    return new Route(this, this._operators[name]);
  }

  static createExample(blob) {
    if (blob['examples']) {
      return buildExample(blob, blob['examples']['application/json']);
    } else {
      return buildExample(blob);
    }
  }

  static createDescription(blob,
      { makeLowerCase: makeLowerCase = false, punctuate: punctuate = true } = {}) {
    let desc = blob['description'] ? blob['description'].trim() : blob.trim();

    if (desc.length > 0) {
      if (makeLowerCase) {
        // Make lower case
        desc = desc[0].toLowerCase() + desc.substring(1);
      } else {
        // Make upper case
        desc = desc[0].toUpperCase() + desc.substring(1);
      }

      if (punctuate) {
        // Check for punctuation at the end and add if necessary
        if (desc[desc.length - 1] != '.' && desc[desc.length - 1] != '?'
            && desc[desc.length - 1] != '!') {
          desc += '. ';
        }
      } else {
        // Remove punctuation if it exists
        if (desc[desc.length - 1] == '.' || desc[desc.length - 1] == '?'
            && desc[desc.length - 1] == '!') {
          desc = desc.substring(0, desc.length - 1);
        }
      }

      return desc;
    }

    return '';
  }

  static getJSType(def) {
    if (def instanceof String || (typeof def) == 'string') {
      if (def == 'integer' || def == 'float' || def == 'number') {
        return 'Number';
      } else if (def == 'string') {
        return 'String';
      } else if (def == 'array') {
        return 'Array';
      } else if (def == 'boolean') {
        return 'Boolean';
      } else if (def == 'object') {
        return 'Object';
      } else {
        throw new Error('Unrecognized type: ' + def);
      }
    } else {
      // Assume def is a schema property/response block from swagger
      if (def['type'] == 'object' || 'properties' in def) {
        // For JS typing, don't go any further than just reporting Object
        return 'Object';
      } else if (def['type'] == 'array' || 'items' in def) {
        // An array definition, but provide a parameter
        return 'Array.<' + SwaggerAPI.getJSType(def['items']['type']) + '>';
      } else if (def['schema']) {
        // Unwrap the schema
        return SwaggerAPI.getJSType(def['schema']);
      } else {
        // Unwrap the type
        return SwaggerAPI.getJSType(def['type']);
      }
    }
  }

  static getLocalAPI() {
    if (!localApi) {
      localApi = new SwaggerAPI(fs.readFileSync(
          path.join(__dirname, './swagger.json')));
    }
    return localApi;
  }

  static getRemoteAPI() {
    return null;
  }
}

module.exports = SwaggerAPI;
