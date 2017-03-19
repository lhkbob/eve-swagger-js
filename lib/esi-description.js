const parseParam = require('./RouteParameter');
const parseResult = require('./RouteResult');
const SwaggerAPI = require('./SwaggerAPI');

const logger = require('jsdoc/util/logger');

function checkTypeMatch(name, doc, expected) {
  if (doc && doc.type && doc.type['names'] && doc.type['names'].length > 0) {
    if (doc.type['names'].length != 1 || doc.type['names'][0] != expected) {
      throw new Error(name + ' type does not match expected ' + expected + ': ' + doc.type['names']);
    }
  }
  // Else no type specified so assume it's valid
}

function getDescriptionForRoute(route, paramRules, responseRule, paramArgs) {
  // Main function summary
  let doc = route.description + '\n\n';
  doc += 'This makes an HTTP ' + route.httpMethod.toUpperCase()
      + ' request to ';
  doc += '[`' + route.path + '`](' + route.docURL + '). ';
  doc += 'The route version is `' + route.version + '`. ';

  // Parameter argument discussion
  let ruleDesc = '';
  for (let rule of paramRules) {
    // Update main description based on the parameter rules
    // (this includes route rules that might be filtered)
    let forRule = rule.mainContentDesc();
    if (forRule != '') {
      ruleDesc += forRule + ' ';
    }

    // Now include function arguments linked with rule, if it's not filtered
    if (rule.isFiltered) {
      continue;
    }

    for (let p of paramArgs[rule.name]) {
      let forParam = rule.mainContentDesc(p);
      if (forParam != '') {
        ruleDesc += forParam + ' ';
      }
    }
  }

  if (ruleDesc != '') {
    doc += '\n\n' + ruleDesc + '\n\n';
  }

  // Handle response type discussion
  let responseDesc = responseRule.mainContentDesc();
  if (responseDesc != '') {
    doc += '\n\n' + responseDesc + '\n\n';
  }

  // Now handle the authentication if it exists
  if (route.isTokenRequired) {
    doc += '\n\nThis function must be used with an SSO token that has the following scopes: \n\n';
    for (let scope of route.ssoScopes) {
      doc += '* `' + scope + '`\n';
    }
    doc += '\n';
  }

  return doc;
}

function getRouteParams(route, rawParams) {
  let params = {};
  if (rawParams) {
    for (let raw of rawParams) {
      let rule = parseParam(route, raw.name, raw.rawRule);
      params[rule.name] = rule;
    }
  }

  // Now make default rules for all remaining parameters of the route
  for (let name of route.parameterNames) {
    if (!params[name]) {
      params[name] = parseParam(route, name);
    }
  }

  let toArray = [];
  for (let name of Object.keys(params)) {
    toArray.push(params[name]);
  }
  return toArray;
}

function getRouteResponse(route, rawResponses) {
  if (rawResponses) {
    if (rawResponses.length > 1) {
      throw new Error('Only one esi_returns tag should be used in doc');
    }

    return parseResult(route, rawResponses[0]);
  } else {
    // Default result handling
    return parseResult(route);
  }
}

function updateDoclet(doclet, route, paramRules, responseRule, preRouteDoc = '', otherDocs = []) {
  // Key is paramRule name, value is array of parameter names that are handled
  // by the rule.
  let paramArgs = {};

  // Match with the function arguments if they are provided
  if (doclet.params) {
    // Fill in paramArgs and update the doclet's params object
    for (let param of doclet.params) {
      // Check param against every rule and make sure it only matches one rule
      let argMatches = {};
      for (let rule of paramRules) {
        if (rule.matchesFunctionParameter(param.name)) {
          if (argMatches[param.name]) {
            throw new Error('Function argument ' + param.name
                + ' matches multiple route parameter rules');
          } else {
            argMatches[param.name] = rule;

            // And record paramArgs map ( a rule can match multiple args)
            if (paramArgs[rule.name]) {
              paramArgs[rule.name].push(param.name);
            } else {
              paramArgs[rule.name] = [param.name];
            }
          }
        }
      }

      // Fail if the function argument doesn't map to a route parameter
      if (!argMatches[param.name]) {
        throw new Error('Argument ' + param.name
            + ' does not match any route parameter');
      }

      // Check type (if provided) and then set type to detected type
      let expectedType = argMatches[param.name].expectedType(param.name);
      checkTypeMatch(param.name, param, expectedType);
      param.type = {names: [expectedType]};

      // Concatenate description provided in docs with generated description
      if (param.description) {
        param.description = argMatches[param.name].description(param.name) + ' '
            + param.description;
      } else {
        param.description = argMatches[param.name].description(param.name);
      }
    }
  }

  // Make sure there is an argument for each unfiltered rule
  for (let rule of paramRules) {
    if (!rule.isFiltered && !paramArgs[rule.name]) {
      throw new Error('Route parameter ' + rule.name
          + ' does not match any function argument');
    }
  }

  // Build up main description
  let desc = '';
  let mainDesc = getDescriptionForRoute(route, paramRules, responseRule, paramArgs);
  if (preRouteDoc != '') {
    desc += preRouteDoc;
    desc += '\n\n';
  }
  if (mainDesc != '') {
    desc += mainDesc;
    desc += '\n\n';
  }
  for (let tagDoc of otherDocs) {
    if (tagDoc != '') {
      desc += tagDoc;
      desc += '\n\n';
    }
  }

  doclet.description = desc;

  // Verify return type and set its description
  let docReturns = doclet.returns ? doclet.returns[0] : {};
  checkTypeMatch('Return', docReturns, responseRule.expectedType());

  let returnDesc;
  if (docReturns['description']) {
    returnDesc = docReturns['description'] + ' ' + responseRule.description();
  } else {
    returnDesc = responseRule.description();
  }

  doclet.returns = [ { type: {names: [ responseRule.expectedType() ]}, description: returnDesc } ];
}

// FIXME Can use processingComplete to produce home page probably
module.exports.handlers = exports.handlers = {
  newDoclet: function(e) {
    let route = e.doclet.route;
    if (route) {
      try {
        let paramRules = getRouteParams(route, e.doclet.routeParams);
        let responseRule = getRouteResponse(route, e.doclet.routeResponses);
        updateDoclet(e.doclet, route, paramRules, responseRule, e.doclet.description, e.doclet.tagDescriptions);
      } catch (error) {
        logger.warn(
            'Error in ESI document generation for ' + e.doclet.longname + ': '
            + error.message);
      }
    }
  }
};

