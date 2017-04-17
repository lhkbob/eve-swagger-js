/*
 * Custom mocked out ESIAgent that doesn't actually make any web requests.
 * Uses the swagger api to create response objects. Requests and their expected
 * parameters can be queued up by calling the __expect(routeId, params, token)
 * function defined on the mocked ESIAgent class.
 *
 * This validates the expected parameters schema as well so that the tests
 * must match the swagger definition in order to pass.
 */

const Promise = require('bluebird');
const SwaggerAPI = require('../../../util/SwaggerAPI');


function expectConstructorCall(params) {
  //  - None of the actual ESIAgent parameters are used in the mock
  //  - But ApiProvider should always set everything, so make sure that is true
  expect(Object.keys(params).length).toEqual(7);

  expect(params['service']).toBeDefined();
  expect(params['source']).toBeDefined();
  expect(params['agent']).toBeDefined();
  expect(params['language']).toBeDefined();
  expect(params['timeout']).toBeDefined();
  expect(params['maxConcurrent']).toBeDefined();
  expect(params['minTime']).toBeDefined();
}

function expectRequest(expected, method, url, path, query, body, token) {
  if (!expected) {
    throw new Error('Unexpected request to ' + method + ' ' + url);
  }

  let route = expected.route;

  expect(method).toBe(route.httpMethod);
  expect(url).toBe('/' + route.version + route.path);

  // Check that the properties in path and query are declared by the route and
  // are in the right spot, and that it's in the right spot
  if (path) {
    for (let pathParam of Object.keys(path)) {
      expect(route.isPathParameter(pathParam)).toBeTruthy();
    }
  }
  if (query) {
    for (let queryParam of Object.keys(query)) {
      expect(route.isQueryParameter(queryParam)).toBeTruthy();
    }
  }

  // Validate all declared route parameters against what was passed to the
  // request call.
  let bodyFound = false;
  let nonIgnoredRouteParams = 0;
  for (let param of route.parameterNames) {
    // Parameters that should not be set by the route call:
    //   user_agent, X-User-Agent, datasource, language, token
    if (param == 'user_agent' || param == 'X-User-Agent' || param
        == 'datasource' || param == 'language' || param == "token") {
      expect(expected.paramValue(param)).not.toBeDefined();
      continue;
    }

    // Otherwise the expectation must define the value (and sanity check its
    // definition)
    nonIgnoredRouteParams++;

    let expectedValue = expected.paramValue(param);
    if (expectedValue === undefined) {
      throw new Error('Missing parameter in expected params definition: '
          + param);
    }
    if (expectedValue != null) {
      expect(route.validateParameter(param, expectedValue)).toEqual('');
    } else {
      expect(route.isParameterRequired(param)).toBeFalsy();
    }

    // And the request must have put the value in the appropriate place
    if (route.isPathParameter(param)) {
      expect(path).toBeDefined();
      expect(path[param]).toEqual(expectedValue);
    } else if (route.isQueryParameter(param)) {
      expect(query).toBeDefined();
      expect(query[param]).toEqual(expectedValue);
    } else if (route.isBodyParameter(param)) {
      // Should only encounter one body parameter or things are funky
      expect(bodyFound).toBeFalsy();
      bodyFound = true;
      expect(body).toEqual(expectedValue);
    } else {
      throw new Error('Unsupported route parameter type for ' + param + ' in '
          + route.id);
    }
  }
  // No extra parameters included in the example
  expect(expected.paramNames.length).toEqual(nonIgnoredRouteParams);

  // Check authentication as well
  if (route.isTokenRequired) {
    expect(token).toEqual(expected.token);
  } else {
    // Should not send a token
    expect(token).toEqual('');
    // Sanity check for the test
    expect(expected.token).toEqual('');
  }

  if (body) {
    // Make sure that there is a route parameter of type body
    expect(bodyFound).toBeTruthy();
  }
}


class Expectation {
  constructor(route, params, returns, overrides, token) {
    this._route = route;
    this._params = params;
    this._returns = returns;
    this._overrides = overrides;
    this._token = token;

    if (returns && overrides) {
      throw new Error('Cannot provide both explicit return value and return overrides');
    }
  }

  get route() {
    return this._route;
  }

  get token() {
    return this._token;
  }

  get returns() {
    return this._returns;
  }

  get overrides() {
    return this._overrides;
  }

  paramValue(key) {
    return this._params[key];
  }

  get paramNames() {
    return Object.keys(this._params);
  }
}

class MockESIRequestHandler {
  constructor(agent, token) {
    this._agent = agent;
    this._token = token;
  }

  _request(method, url, path, query, body) {
    let expectedCall = this._agent._expect.shift();

    return Promise.try(() => {
      expectRequest(expectedCall, method, url, path, query, body, this._token);
      if (expectedCall.returns != null) {
        // Sanity check and make sure the overridden result value is valid
        expect(expectedCall.route.validateResponse(expectedCall.returns))
        .toEqual('');

        return expectedCall.returns;
      } else {
        if (expectedCall.route.responseStatus == 204) {
          // No response definition provided for a 204
          return {};
        } else {
          // Assume the created example matches the spec
          let result = SwaggerAPI.createExample(expectedCall.route.responseData);
          // And then possibly apply any overrides
          if (expectedCall.overrides != null) {
            result = Object.assign(result, expectedCall.overrides);
            expect(expectedCall.route.validateResponse(result))
            .toEqual('');
          }

          return result;
        }
      }
    });
  }

  get(url, { path: path = null, query: query = null } = {}) {
    return this._request('GET', url, path, query, null);
  }

  put(url, { path: path = null, query: query = null, body: body = null } = {}) {
    return this._request('PUT', url, path, query, body);
  }

  post(url,
      { path: path = null, query: query = null, body: body = null } = {}) {
    return this._request('POST', url, path, query, body);
  }

  del(url, { path: path = null, query: query = null, body: body = null } = {}) {
    return this._request('DELETE', url, path, query, body);
  }
}

class MockESIAgent {
  constructor(params) {
    // Constructor call validation
    expectConstructorCall(params);

    this._api = SwaggerAPI.getLocalAPI();
    this._expect = [];
  }

  get noAuth() {
    return new MockESIRequestHandler(this, '');
  }

  auth(token) {
    return new MockESIRequestHandler(this, token);
  }

  __expectRoute(route, params,
      { returns: returns = null, overrides: overrides = null, token: token = '' } = {}) {
    let realRoute = this._api.route(route);
    this._expect.push(new Expectation(realRoute, params, returns, overrides, token));
  }

  __reset() {
    this._expect = [];
  }
}

module.exports = MockESIAgent;
