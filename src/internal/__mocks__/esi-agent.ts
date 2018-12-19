/*
 * Custom mocked out ESIAgent that doesn't actually make any web requests.
 * Uses the swagger api to create response objects. Requests and their expected
 * parameters can be queued up by calling the __expect(routeId, params, token)
 * function defined on the mocked ESIAgent class.
 *
 * This validates the expected parameters schema as well so that the tests
 * must match the swagger definition in order to pass.
 */

import * as swagger from '../../../util/esi-api';
import { Parameters, Responses, ROUTE_MAP, esi  } from '../../../gen/esi';

function expectConstructorCall(params: Configuration): void {
  //  - None of the actual ESIAgent parameters are used in the mock
  //  - But ApiProvider should always set everything, so make sure that is true
  expect(Object.keys(params).length).toEqual(14);

  expect(params.url).toBe('https://esi.evetech.net');
  expect(params.source).toBe('tranquility');
  expect(params.userAgent).toBe('eve-swagger | https://github.com/lhkbob/eve-swagger-js');
  expect(params.language).toBe(esi.Language.EN_US);
  expect(params.timeout).toBe(6000);
  expect(params.maxConcurrentRequests).toBe(0);
  expect(params.minTimeBetweenRequests).toBe(0);
  expect(params.maxQueueSize).toBe(-1);
  expect(params.respectErrorLimit).toBe(true);
  expect(params.maxResponseTTL).toBe(Number.POSITIVE_INFINITY);
  expect(params.errorTTL).toBe(5 * 60 * 1000);
  expect(params.accessTokenTTL).toBe(10 * 60 * 1000);
  expect(params.userAgentDelivery).toBe('x-header');
  expect(params.accessTokenDelivery).toBe('header');
}

function expectRequest(expected: Expectation,
    method: 'GET' | 'POST' | 'DELETE' | 'PUT', url: string, path?: object,
    query?: object, body?: any, token?: string): void {
  if (!expected) {
    throw new Error('Unexpected request to ' + method + ' ' + url);
  }

  let route = expected.route;

  expect(method).toBe(route.httpMethod.toUpperCase());
  expect(url).toBe(route.path);

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
        == 'datasource' || param == 'language' || param == 'token') {
      expect(expected.paramValue(param)).not.toBeDefined();
      continue;
    }

    // Otherwise the expectation must define the value (and sanity check its
    // definition)
    nonIgnoredRouteParams++;

    let expectedValue = expected.paramValue(param);
    if (expectedValue !== undefined) {
      expect(route.validateParameter(param, expectedValue)).toEqual('');
    } else {
      expect(route.isParameterRequired(param)).toBeFalsy();
    }

    // And the request must have put the value in the appropriate place
    if (route.isPathParameter(param)) {
      expect(path).toBeDefined();
      if (expectedValue !== undefined) {
        expect(path[param]).toEqual(expectedValue);
      } else {
        expect(path[param]).not.toBeDefined();
      }
    } else if (route.isQueryParameter(param)) {
      expect(query).toBeDefined();
      if (expectedValue !== undefined) {
        expect(query[param]).toEqual(expectedValue);
      } else {
        expect(query[param]).not.toBeDefined();
      }
    } else if (route.isBodyParameter(param)) {
      // Should only encounter one body parameter or things are funky
      expect(bodyFound).toBeFalsy();
      bodyFound = true;
      if (expectedValue !== undefined) {
        expect(body).toEqual(expectedValue);
      } else {
        expect(body).not.toBeDefined();
      }
    } else {
      throw new Error(
          'Unsupported route parameter type for ' + param + ' in ' + route.id);
    }
  }
  // No extra parameters included in the example
  expect(expected.paramNames.length).toEqual(nonIgnoredRouteParams);

  // Check authentication as well
  if (route.isTokenRequired) {
    expect(token).toEqual(expected.token);
  } else {
    // Should not send a token
    expect(token).not.toBeDefined();
    // Sanity check for the test
    expect(expected.token).not.toBeDefined();
  }

  if (body) {
    // Make sure that there is a route parameter of type body
    expect(bodyFound).toBeTruthy();
  }
}

class Expectation {
  constructor(readonly route: swagger.Route,
      private params: { [index: string]: any }, readonly returns?: object,
      readonly overrides?: object, readonly token?: string) {

    if (returns !== undefined && overrides !== undefined) {
      throw new Error(
          'Cannot provide both explicit return value and return overrides');
    }
  }

  paramValue(key: string): any {
    return this.params[key];
  }

  get paramNames(): string[] {
    return Object.keys(this.params);
  }
}

// FIXME maybe figure out how to import the real esi-agent and then re-export
// its definition of Configuration and SSOAgent
export interface Configuration {
  url: string;
  source: string;
  userAgent: string;
  language: esi.Language,
  timeout: number;
  maxConcurrentRequests: number;
  minTimeBetweenRequests: number;
  maxQueueSize: number;
  respectErrorLimit: boolean;
  maxResponseTTL: number;
  errorTTL: number;
  accessTokenTTL: number;
  userAgentDelivery: 'query' | 'x-header' | 'header';
  accessTokenDelivery: 'query' | 'header';
}

export interface SSOAgent {
  readonly agent: ESIAgent;
  readonly ssoToken: string;
  readonly id: number;
}

export class ESIAgent {
  private api: swagger.API;
  private expects: Expectation[];

  constructor(readonly configuration: Configuration) {
    expectConstructorCall(configuration);
    this.api = swagger.API.getLocalAPI();
    this.expects = [];
  }

  request<ID extends keyof Responses & keyof Parameters>(route: ID,
      parameters: Parameters[ID],
      accessToken?: string): Promise<Responses[ID]> {

    return Promise.resolve().then(() => {
      const config = ROUTE_MAP[route];
      const pathArgs = parameters ? (parameters as any).path : undefined;
      const queryArgs = parameters ? (parameters as any).query : undefined;
      const body = parameters ? (parameters as any).body : undefined;

      let expectedCall = this.expects.shift();
      expect(expectedCall).toBeDefined();

      return Promise.resolve().then(() => {
        expectRequest(expectedCall!, config.method, config.url, pathArgs,
            queryArgs, body, accessToken);
        if (expectedCall.returns !== undefined) {
          // Sanity check and make sure the overridden result value is valid
          expect(expectedCall.route.validateResponse(expectedCall.returns))
          .toEqual('');
          return expectedCall.returns;
        } else {
          if (expectedCall.route.responseStatus === 204) {
            // No response definition provided for a 204
            return undefined;
          } else {
            // Assume the created example matches the spec
            let result = expectedCall.route.createResponseExample();
            if (expectedCall.overrides !== undefined) {
              result = Object.assign(result, expectedCall.overrides);
              expect(expectedCall.route.validateResponse(result)).toEqual('');
            }

            return result;
          }
        }
      });
    });
  }

  __expectRoute(route: string, params: { [index: string]: any },
      optionalParams: { returns?: any, overrides?: any, token?: string } = {}) {
    let realRoute = this.api.route(route);
    this.expects.push(new Expectation(realRoute, params, optionalParams.returns,
        optionalParams.overrides, optionalParams.token));
  }

  __reset() {
    let len = this.expects.length;
    this.expects = [];

    expect(len).toEqual(0);
  }
}
