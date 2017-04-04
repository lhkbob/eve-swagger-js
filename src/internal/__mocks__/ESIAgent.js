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
  expect(expected).toBeDefined();

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
    //   user_agent, X-User-Agent, datasource, language
    if (param == 'user_agent' || param == 'X-User-Agent' || param
        == 'datasource' || param == 'language') {
      expect(expected.paramValue(param)).not.toBeDefined();
      continue;
    }

    // Otherwise the expectation must define the value (and sanity check its
    // definition)
    nonIgnoredRouteParams++;

    let expectedValue = expected.paramValue(param);
    expect(expectedValue).toBeDefined();
    expect(route.validateParameter(param, expectedValue)).toEqual('');

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

    // Check authentication as well
    if (route.isTokenRequired) {
      expect(token).toEqual(expected.token);
    } else {
      // Should not send a token
      expect(token).toEqual('');
      // Sanity check for the test
      expect(expected.token).toEqual('');
    }
  }
  // No extra parameters included in the example
  expect(expected.paramNames.length).toEqual(nonIgnoredRouteParams);

  if (body) {
    // Make sure that there is a route parameter of type body
    expect(bodyFound).toBeTruthy();
  }
}


class Expectation {
  constructor(route, params, returns, token) {
    this._route = route;
    this._params = params;
    this._returns = returns;
    this._token = token;
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
        // Assume the created example matches the spec
        return SwaggerAPI.createExample(expectedCall.route.responseData);
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

  del(url, { path: path = null, query: query = null } = {}) {
    return this._request('DELETE', url, path, query, null);
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
      { returns: returns = null, token: token = '' } = {}) {
    let realRoute = this._api.route(route);
    this._expect.push(new Expectation(realRoute, params, returns, token));
  }
}

module.exports = MockESIAgent;
