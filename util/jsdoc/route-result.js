const SwaggerAPI = require('../swagger-api');

function isArrayResponse(route) {
  let schema = route.responseData['schema'];
  return schema && (schema['type'] == 'array' || 'items' in schema);
}

function getItemSchema(route) {
  let schema = route.responseData['schema'];
  if (schema) {
    if (schema['type'] == 'array' || 'items' in schema) {
      return schema['items'];
    } else {
      return schema;
    }
  } else {
    return {};
  }
}

class ResultRule {
  constructor(route) {
    this._route = route;
  }

  includeExampleInDesc() {
    let type = this.expectedType();
    return type == 'Promise.<Object>' || type == 'Promise.<Array.<Object>>';
  }

  mainContentDesc() {
    let desc = 'On success, this resolves to ' + SwaggerAPI.createDescription(
            this._route.responseData, { makeLowerCase: true });

    if (this.includeExampleInDesc()) {
      desc += ' An example result is:\n\n```\n' + JSON.stringify(this.example(),
              null, '  ') + '\n```\n';
    }
    return desc;
  }

  description() {
    return 'A Promise that resolves to the parsed JSON of the response.';
  }

  expectedType() {
    return 'Promise.<' + SwaggerAPI.getJSType(this._route.responseData) + '>';
  }

  example() {
    return SwaggerAPI.createExample(this._route.responseData);
  }
}

class NoResultRule extends ResultRule {
  constructor(route) {
    super(route);
    if (route.responseStatus != 204) {
      throw new Error('Response status is not expected 204: '
          + route.responseStatus);
    } else if (route.responseData && (route.responseData['type']
        || route.responseData['schema'])) {
      throw new Error('Route unexpectedly provides response specification.');
    }
  }

  includeExampleInDesc() {
    return false;
  }

  mainContentDesc() {
    return 'On success, this resolves to an empty object.';
  }

  description() {
    return 'A Promise that resolves to an empty object.';
  }

  expectedType() {
    return 'Promise.<Object>';
  }

  example() {
    return {};
  }
}

class SelectPropertyRule extends ResultRule {
  constructor(route, filter) {
    super(route);

    this._array = isArrayResponse(route);

    let props = getItemSchema(route);
    if (!props || !props['properties']) {
      throw new Error('Response does not define schema with properties');
    }

    if (!(filter in props['properties'])) {
      throw new Error('Response schema does not define property: ' + filter);
    }

    this._filter = filter;
  }

  mainContentDesc() {
    let desc = super.mainContentDesc();
    desc += ' Note that the type schema of the response is modified from what is defined in ESI. Specifically, it returns only the `'
        + this._filter + '` property.';

    return desc;
  }

  description() {
    let blob = getItemSchema(this._route)['properties'][this._filter];
    return 'A Promise that resolves to ' + SwaggerAPI.createDescription(blob,
            { makeLowerCase: true });
  }

  expectedType() {
    let resolveType;
    let blob = getItemSchema(this._route)['properties'][this._filter];
    if (this._array) {
      resolveType = 'Array.<' + SwaggerAPI.getJSType(blob) + '>';
    } else {
      resolveType = SwaggerAPI.getJSType(blob);
    }

    return 'Promise.<' + resolveType + '>';
  }

  example() {
    let blob = getItemSchema(this._route)['properties'][this._filter];
    if (this._array) {
      return [
        SwaggerAPI.createExample(blob)
      ];
    } else {
      return SwaggerAPI.createExample(blob);
    }
  }
}

class IdResultRule extends ResultRule {
  constructor(route, filter = '') {
    super(route);

    if (route.responseStatus != 201) {
      throw new Error('Response status is not expected 201: '
          + route.responseStatus);
    }

    let multiId = false;

    if (route.responseData['type'] != 'integer') {
      multiId = isArrayResponse(route);
      let props = getItemSchema(route);

      if (filter == '') {
        if (props['type'] != 'integer') {
          throw new Error('Response is not a simple integer or integer array, must provide filter rule');
        }
      } else {
        if (!props['properties'][filter] || props['properties'][filter]['type'] != 'integer') {
          throw new Error('Response property ' + filter
              + ' type is not integer');
        }
      }
    }

    this._filter = filter;
    this._multi = multiId;
  }

  _idDesc() {
    return this._multi ? 'array of ids' : 'id';
  }

  mainContentDesc() {
    let desc = 'On success, this resolves to the ' + this._idDesc() + ' of the created ' + (this._array ? 'entities' : 'entity') + '.';
    if (this._filter != '') {
      desc += ' The id is extracted from the `' + this._filter
          + '` property of the response object.';
    }
    return desc;
  }

  description() {
    return 'A Promise that resolves to an ' + this._idDesc() + '.';
  }

  expectedType() {
    return this._multi ? 'Promise.<Array.<Number>>' : 'Promise.<Number>';
  }

  example() {
    return this._multi ? [1] : 1;
  }
}

class FilteredResultRule extends ResultRule {
  constructor(route, renames, excludes) {
    super(route);

    // Make sure the response type is an object with a schema defining
    // everything mentioned in renames and excludes
    this._array = isArrayResponse(route);

    let props = getItemSchema(route);
    if (!props || !props['properties']) {
      throw new Error('Route response does not define a schema with properties');
    }

    for (let e of excludes) {
      if (!props['properties'][e]) {
        throw new Error('Excluded property is not defined in response schema: '
            + e);
      }
    }
    for (let r of Object.keys(renames)) {
      if (!props['properties'][r]) {
        throw new Error('Renamed property is not defined in response schema: '
            + r);
      }
      if (props['properties'][renames[r]]) {
        throw new Error('Response property, ' + r
            + ', renamed to an existing property: ' + renames[r]);
      }
    }

    this._renames = renames;
    this._excludes = excludes;
  }

  mainContentDesc() {
    let desc = super.mainContentDesc();
    desc += ' Note that the type schema of the response is modified from what is defined in ESI. Specifically:\n\n';
    for (let e of this._excludes) {
      desc += ' + The `' + e + '` property is removed.\n';
    }
    for (let r of Object.keys(this._renames)) {
      desc += ' + The `' + r + '` property is renamed to `' + this._renames[r]
          + '`.\n';
    }
    desc += '\n';

    return desc;
  }

  expectedType() {
    // While fields might be renamed or excluded, the type remains an object
    return this._array ? 'Promise.<Array.<Object>>' : 'Promise.<Object>';
  }

  _filterExample(ex) {
    for (let e of this._excludes) {
      delete ex[e];
    }
    for (let r of Object.keys(this._renames)) {
      let v = ex[r];
      delete ex[r];
      ex[this._renames[r]] = v;
    }
  }

  example() {
    let ex = super.example();
    if (this._array) {
      for (let e of ex) {
        this._filterExample(e);
      }
      return ex;
    } else {
      return this._filterExample(ex);
    }
  }
}

function parseFilterRule(route, rawRule) {
  let propRules = rawRule.substring(1, rawRule.length - 1).split(',');
  let excludes = [];
  let renames = {};

  for (let rule of propRules) {
    let colon = rule.indexOf(':');
    if (colon < 0) {
      // A simple exclude, but confirm it starts with !
      let exclude = rule.trim();
      if (exclude[0] != '!') {
        throw new Error('Bad syntax for response filter, excludes must start with "!": '
            + exclude);
      }

      excludes.push(exclude.substring(1));
    } else {
      // Split on colon for property and new name
      let prop = rule.substring(0, colon).trim();
      renames[prop] = rule.substring(colon + 1).trim();
    }
  }

  return new FilteredResultRule(route, renames, excludes);
}

function parseRule(route, rawRule) {
  if (rawRule == null || rawRule === undefined) {
    // Guess the rule based on response type
    if (route.responseStatus == 204) {
      return new NoResultRule(route);
    } else if (route.responseStatus == 201) {
      return new IdResultRule(route);
    } else {
      return new ResultRule(route);
    }
  } else {
    if (rawRule == '') {
      // For some reason, they explicitly asked for the default rule
      return new ResultRule(route);
    }
    if (rawRule[0] == '{' && rawRule[rawRule.length - 1] == '}') {
      // This is going to be a filter rule
      return parseFilterRule(route, rawRule);
    } else if (rawRule.startsWith('id:')) {
      // This is an IdResultRule, possibly with a rule
      return new IdResultRule(route, rawRule.substring(3));
    } else if (rawRule == 'none') {
      // This is a NoResultRule
      return new NoResultRule(route);
    } else {
      // Assume the rule specifies the filter for a SelectPropertyRule
      return new SelectPropertyRule(route, rawRule);
    }
  }
}

module.exports = parseRule;
