const SwaggerAPI = require('./SwaggerAPI');

// Parameters common to all ESI routes that are handled at a lower level by the
// library
const FILTER_PARAMS = [
  'token', 'datasource', 'language', 'user_agent', 'X-User-Agent'
];

function getCanonicalParameterName(param) {
  let name = [];
  for (let c of param) {
    if (c.toUpperCase() == c && c.toLowerCase() != c) {
      // Upper case character so convert from camel-case to underscore with
      // lower case
      name.push('_');
      name.push(c.toLowerCase());
    } else {
      name.push(c);
    }
  }

  return name.join('');
}

function rangeString(prefix, min, max) {
  if (min !== undefined && max !== undefined) {
    return prefix + ' must be between `' + min + '` and `' + max + '`. ';
  } else if (min !== undefined) {
    return prefix + ' must be at least `' + min + '`. ';
  } else if (max !== undefined) {
    return prefix + ' can be at most `' + max + '`. ';
  } else {
    return '';
  }
}

// The default parameter rule, whose behavior assumes that the entire parameter
// maps to the entire function argument. By default filters path parameters and
// parameters in FILTER_PARAMS
class ParameterRule {
  constructor(route, name) {
    this._route = route;
    this._name = name;
  }

  get name() {
    return this._name;
  }

  get isFiltered() {
    for (let p of FILTER_PARAMS) {
      if (this._name == p) {
        return true;
      }
    }

    return this._route.isPathParameter(this._name);
  }

  matchesFunctionParameter(param) {
    return this._name == param || this._name == getCanonicalParameterName(
            param);
  }

  _mainDesc(param, data) {
    let desc = '';
    let type = SwaggerAPI.getJSType(data);
    // Include examples if type is object or array of objects
    if (type == 'Object' || type == 'Array.<Object>') {
      desc += 'An example value for `' + param + '` is shown below:\n\n```\n';
      desc += JSON.stringify(this.example(param), null, '  ');
      desc += '```\n\n';
    }

    if ('schema' in data) {
      data = data['schema'];
    }

    // String or numeric constraints
    if ('enum' in data) {
      desc += '`' + param
          + '` must be one of the following specific values or the request will fail:\n\n';
      for (let e of data['enum']) {
        desc += '* `' + e + '`\n';
      }
      desc += '\n\n';
    }

    // Numeric constraints
    desc += rangeString('`' + param + '`', data['minimum'], data['maximum']);

    // String constraints
    desc += rangeString('The string length of `' + param + '`',
        data['minLength'], data['maxLength']);

    // Array constraints
    desc += rangeString('The array length of `' + param + '`', data['minItems'],
        data['maxItems']);

    return desc;
  }

  static _paramDesc(data) {
    let optional = !(data['required'] || !data['default']);

    let desc = '';
    if (optional) {
      desc += 'Optional; ';
    }

    if ('description' in data) {
      desc += SwaggerAPI.createDescription(data, { makeLowerCase: optional });
    }

    return desc;
  }

  mainContentDesc(param = '') {
    // Does not provide any default documentation
    if (param == '') {
      return '';
    }

    // Assumes param == this._name
    return this._mainDesc(param,
        this._route.parameterData(this._name));
  }

  expectedType(param) {
    // By default, param can only match this._name, so calculate the type
    // based on the entire type specified in swagger
    return SwaggerAPI.getJSType(this._route.parameterData(this._name));
  }

  description(param) {
    // As with expectedType, must match this._name so return the highest level
    // description in the parameter data
    return ParameterRule._paramDesc(this._route.parameterData(this._name));
  }

  example(param) {
    // Generate example from highest level blob
    return SwaggerAPI.createExample(this._route.parameterData(this._name));
  }
}

// Marks a route parameter as filtered, so it also doesn't match any function
// args, generally because the parameter was optional and not used for the
// function
class FilteredParameterRule extends ParameterRule {
  constructor(route, name) {
    super(route, name);
  }

  get isFiltered() {
    return true;
  }

  matchesFunctionParameter(param) {
    return false;
  }
}

// Overrides default filter rules to always include something, but otherwise
// doesn't change default behavior.
class IncludeParameterRule extends ParameterRule {
  constructor(route, name) {
    super(route, name);
  }

  get isFiltered() {
    return false;
  }
}

// Overrides function parameter matching to explicitly match a name
class RenameParameterRule extends IncludeParameterRule {
  constructor(route, name, arg) {
    super(route, name);
    this._arg = arg;
  }

  matchesFunctionParameter(param) {
    return this._arg == param;
  }
}

// Marks a route parameter as having the function assign a fixed
// value in order to implement its functionality. Updates the main content
// description.
class AssignedParameterRule extends FilteredParameterRule {
  constructor(route, name, value) {
    super(route, name);
    this._value = value;
  }

  mainContentDesc(param = '') {
    if (param == '') {
      // The default content, which should add a sentence describing the
      // assigned value.
      return 'This function invokes the route with `' + this._name
          + '` set to `' + JSON.stringify(this._value) + '`. ';
    } else {
      return '';
    }
  }
}

class DecomposedParameterRule extends IncludeParameterRule {
  constructor(route, name, renames, assignments) {
    super(route, name);
    this._renames = renames;
    this._assignments = assignments;

    let providedProps = {};
    for (let p of Object.keys(renames).concat(Object.keys(assignments))) {
      if (providedProps[p]) {
        throw new Error('Duplicate specification for decomposed property: '
            + p);
      }
      providedProps[p] = p;
    }

    let props = route.parameterData(name)['schema'];
    if (!props || !props['properties']) {
      throw new Error('Parameter ' + name
          + ' does not provide a schema with properties');
    }

    if (Object.keys(providedProps).length != Object.keys(
            props['properties']).length) {
      throw new Error('Parameter ' + name
          + 'decomposition is invalid, count mismatch');
    }
    for (let p of Object.keys(providedProps)) {
      if (!props['properties'][p]) {
        throw new Error('Parameter ' + name + ' does not have ' + p
            + ' as a property');
      }
    }

    this._props = props;
  }

  _argToProperty(arg) {
    for (let n of Object.keys(this._renames)) {
      if (this._renames[n] == arg) {
        return n;
      }
    }
    throw new Error('Unable to find property matching arg ' + arg);
  }

  get isFiltered() {
    // If there are no renames then all properties have an assignment so
    // the entire property is assigned something
    return super.isFiltered || Object.keys(this._renames).length == 0;
  }

  matchesFunctionParameter(param) {
    for (let n of Object.keys(this._renames)) {
      if (this._renames[n] == param) {
        return true;
      }
    }
    return false;
  }

  mainContentDesc(param = '') {
    if (param == '') {
      // Document decomposition and possibly any assignments
      let desc = 'The route parameter, `' + this._name
          + '`, is built implicitly by the function. ';
      for (let assign of Object.keys(this._assignments)) {
        desc += 'The property `' + assign + '` of the object is set to `'
            + JSON.stringify(this._assignments[assign]) + '`. ';
      }
      return desc;
    } else {
      let prop = this._argToProperty(param);
      // Document specific renames depending on their type
      return 'The function argument `' + param + '` maps to the `' + prop
          + '` property of the `' + this._name + '` route parameter. '
          + this._mainDesc(param, this._props['properties'][prop]);
    }
  }

  expectedType(param) {
    let prop = this._argToProperty(param);
    return SwaggerAPI.getJSType(this._props['properties'][prop]);
  }

  description(param) {
    let prop = this._argToProperty(param);
    return SwaggerAPI.createDescription(this._props['properties'][prop]);
  }

  example(param) {
    // Building the full example first allows for combining a provided example
    // at the top-level with the version created from the schema.
    let fullExample = SwaggerAPI.createExample(
        this._route.parameterData(this._name));
    return fullExample[this._argToProperty(param)];
  }
}

function parseDecompositionRule(route, name, rawRule) {
  if (rawRule[0] != '{' || rawRule[rawRule.length - 1] != '}') {
    throw new Error('Parameter ' + name
        + ' has bad syntax for decomposition rule');
  }

  let propRules = rawRule.substring(1, rawRule.length - 1).split(',');
  let assignments = {};
  let renames = {};

  for (let rule of propRules) {
    let colon = rule.indexOf(':');
    if (colon < 0) {
      // A simple decompose, without any rename (so simulate as an identity
      // rename)
      let prop = rule.trim();
      renames[prop] = prop;
    } else {
      // Split on colon for property and value
      let prop = rule.substring(0, colon).trim();
      let value = rule.substring(colon + 1).trim();

      let assignment;
      try {
        assignment = JSON.parse(value);
      } catch(e) {
        assignment = null;
      }
      if (assignment != null) {
        // An explicit assignment
        assignments[prop] = assignment;
      } else {
        // A rename
        renames[prop] = value;
      }
    }
  }

  return new DecomposedParameterRule(route, name, renames, assignments);
}

function parseRule(route, name, rawRule) {
  // console.log('Parsing rule for ' + route.id + '+' + name + ': ' + rawRule);

  if (rawRule == null || rawRule === undefined) {
    return new ParameterRule(route, name);
  } else if (rawRule == '') {
    // This is one of the simpler rules, either an explicit include or filter
    if (name[0] == '!') {
      return new FilteredParameterRule(route, name.substring(1));
    } else {
      return new IncludeParameterRule(route, name);
    }
  } else {
    // One of the more complex rules, either a rename, an assign or a
    // decomposition (which might have its own assignments and renames)
    let assignment;
    try {
      assignment = JSON.parse(rawRule);
    } catch(e) {
      assignment = null;
    }

    if (assignment != null) {
      // An assignment
      return new AssignedParameterRule(route, name, assignment);
    } else if (rawRule.indexOf('{') < 0) {
      // A rename
      return new RenameParameterRule(route, name, rawRule);
    } else {
      // A decomposition
      return parseDecompositionRule(route, name, rawRule);
    }
  }
}

module.exports = parseRule;
