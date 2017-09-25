import Bottleneck from 'bottleneck';
import * as SuperAgent from 'superagent';
import * as Moment from 'moment';

import { ROUTE_MAP, Responses, Parameters, esi } from '../../gen/esi';
import { ESIError, ErrorName } from '../error';
import Cache from './cache';

/**
 * Configuration options for the {@link ESIAgent}.
 */
export interface Configuration {
  /**
   * The URL to the ESI service, including protocol, port, etc.
   */
  url: string;
  /**
   * The data source used for all requests, such as `tranquility` or
   * `singularity`.
   */
  source: string;
  /**
   * The user agent identifying the program or application to the service.
   */
  userAgent: string;
  /**
   * The default language for responses that support localization.
   */
  language: esi.Language,
  /**
   * The timeout for all requests to the ESI service.
   */
  timeout: number;
  /**
   * The maximum number of concurrent requests that are open, others will be
   * blocked by the internal rate limiter until one of the current requests
   * completes. A value of 0 disables this feature of the rate limiter.
   */
  maxConcurrentRequests: number;
  /**
   * The minimum time (in milliseconds) between the start of requests;
   * regardless of the number of concurrent requests this introduces a fixed
   * delay between requests. A value of 0 disables this feature of the rate
   * limiter.
   */
  minTimeBetweenRequests: number;
  /**
   * The maximum length of the rate limiting queue. If the size of the queue
   * exceeds this value then old requests in the queue will be rejected.
   * Negative size means the queue is unlimited.
   */
  maxQueueSize: number;
  /**
   * Enable or disable automatic support for limiting requests based on the
   * `X-ESI-Error-Limit-Remain` header. This can be enabled even if the rate
   * limiting for normal requests are disabled.
   */
  respectErrorLimit: boolean;
  /**
   * Impose a maximum time (in milliseconds) that responses can stay in the
   * cache. If this value is too small, it may undercut the automatically
   * determined cache time set by the ESI service. In this case, a subsequent
   * re-request would be made as normal and likely hit ESI's server cache
   * instead of the local cache of this library. Thus, the max time can be used
   * to control memory overhead of the local cache.
   *
   * A value of less than or equal to 0 disables caching responses completely. A
   * value of positive infinity means that the expiration header provided by ESI
   * will always be respected (although this could mean that a value is in the
   * cache for hours to days since some routes are quite long).
   *
   * Note that this TTL only refers to successful requests and responses.
   * Requests that fail are cached based on the `errorTTL`. Additionally, if a
   * request requires an access token and `accessTokenTTL` is not positive, then
   * those requests will skip this response cache. However, if access tokens are
   * cached then the successful responses will be cached using this TTL as well.
   */
  maxResponseTTL: number;
  /**
   * Specify the cache lifetime (in milliseconds) for requests that fail with
   * errors. A failed request likely will not provide an expiration header so
   * this value is used universally for all failures.
   *
   * Enabling error caching with finite, positive TTL can be an effective way of
   * mitigating the service's error rate limits that eventually block all
   * requests, without resorting to the full-stop rate limiting the client is
   * forced to impose if the error rate limit is close to being exceeded. The
   * downside is that if errors are caused by service interruptions, the error
   * may continue to be reported from the cache past when service is actually
   * restored.
   *
   * If the TTL is less than or equal to 0, failed requests will not be cached
   * at all. This means repeatedly attempting a failing request could start
   * impacting the error limit that ESI imposes. A positive infinity value
   * means failed requests will be cached forever (not recommended).
   */
  errorTTL: number;
  /**
   * Lifetime in milliseconds for the access-token specific request caches.
   * Access tokens expire after certain amount of time in the ESI service. This
   * TTL should be less than the actual time it takes for an access token to
   * expire (20 minutes) so that subsequent requests are more likely to trigger
   * a refresh of the token's lifetime. If an access-token requiring request is
   * cached, but its access token is not, then the request will be executed to
   * force a refresh of the access token's lifetime in ESI.
   *
   * A value less than or equal to 0 disables caching of access tokens (and all
   * requests that use access tokens). Positive infinity caches access tokens
   * without expiration (not recommended), although requests using access tokens
   * can still expire based on their own expiration.
   */
  accessTokenTTL: number;
  /**
   * Specify how the user agent is provided in requests. The ESI interface
   * supports accepting a `user_agent` query parameter, a custom `X-User-Agent`
   * header, and the standard `User-Agent` header.
   */
  userAgentDelivery: 'query' | 'x-header' | 'header';
  /**
   * Specify how access tokens are provided in requests. The ESI interface
   * supports reading tokens from the `token` query parameter or the standard
   * `Authorization` header.
   */
  accessTokenDelivery: 'query' | 'header';
}

/**
 * Information required to make authenticated requests. This is just a simple
 * object that bundles an ESIAgent, an SSO token, and the id of the resource
 * that is authenticated with the token. The id can refer to a character,
 * corporation, or fleet and is entirely dependent on context.
 */
export interface SSOAgent {
  /**
   * The agent to make requests with.
   */
  readonly agent: ESIAgent;
  /**
   * The token to use for authenticating requests.
   */
  readonly ssoToken: string;
  /**
   * The ID of the resource accessible with the provided SSO token.
   */
  readonly id: number;
}

/**
 * ESIAgent is a low-level request handler for making HTTP requests to the ESI
 * service. It internally manages a response cache, an access token cache,
 * generic rate limiting, and can respect the error rate limiting imposed by the
 * service. This should not be used directly, but is called by the higher level
 * API functions. These functions package up the required route parameters,
 * route ID, and potentially filter the response type to a cleaner
 * representation.
 */
export class ESIAgent {
  private defaultOpts: object;
  private responseCache: Cache<Promise<any> | ESIError>;
  private accessTokenCache: Cache<boolean>;
  private limiter: Bottleneck;
  // limiter is chained against errorRateLimiter, which has its settings
  // periodically tuned based on the X-Error-Limit headers
  private errorRateLimiter: Bottleneck | undefined;
  private errorLimiterActive: boolean;

  /**
   * Create a new ESIAgent with the given configuration for the service,
   * rate limiting, and caching behaviors managed by the agent.
   *
   * @param configuration The configuration of the agent
   * @constructor
   */
  constructor(readonly configuration: Configuration) {
    let options: any = {
      'datasource': configuration.source, 'language': configuration.language
    };
    if (configuration.userAgentDelivery === 'query') {
      options['user_agent'] = this.configuration.userAgent;
    }

    this.defaultOpts = options;
    this.limiter = new Bottleneck(configuration.maxConcurrentRequests,
        configuration.minTimeBetweenRequests, configuration.maxQueueSize,
        Bottleneck.strategy.LEAK, /* reject leaked jobs */ true);
    if (configuration.respectErrorLimit) {
      this.errorRateLimiter = new Bottleneck(0, 0, -1, Bottleneck.strategy.LEAK,
          false);
      this.limiter.chain(this.errorRateLimiter);
    } else {
      this.errorRateLimiter = undefined;
    }

    this.errorLimiterActive = false;

    this.responseCache = new Cache(this.configuration.maxResponseTTL);
    this.accessTokenCache = new Cache(this.configuration.accessTokenTTL);
  }

  /**
   * Make a request to the given ESI route, returning a Promise that resolves to
   * the appropriate type associated with the route ID. If there is a failure,
   * the promise will be rejected with an ESIError instance that contains the
   * request and response information for debugging purposes.
   *
   * The request may be rate limited based on the default rate limiting
   * configuration, or the explicit error rate limiting imposed by the ESI
   * service. Additionally, if the exact request is in the cache and hasn't
   * expired, the returned Promise may resolve immediately with the previous
   * response body.
   *
   * @param route The ID of the route that is requested
   * @param parameters Path, query, and body parameters for the route
   * @param accessToken An access token if the route requires one for
   *     authentication
   * @returns A Promise resolving to the response body, parsed into the
   * appropriate route's response type.
   */
  request<ID extends keyof Responses & keyof Parameters>(route: ID,
      parameters: Parameters[ID],
      accessToken?: string): Promise<Responses[ID]> {

    return Promise.resolve().then(() => {
      const config = ROUTE_MAP[route];
      const pathArgs = parameters ? (parameters as any).path : undefined;
      const queryArgs = parameters ? (parameters as any).query : undefined;
      const body = parameters ? (parameters as any).body : undefined;

      const request = {
        method: config.method,
        url: this.buildURL(config.url, pathArgs),
        headers: this.buildHeaders(accessToken),
        query: this.buildQueryParams(queryArgs, accessToken),
        body: body ? JSON.stringify(body) : undefined
      };

      let useCache = accessToken === undefined
          || this.configuration.accessTokenTTL > 0;
      if (useCache) {
        return this.scheduleAndCache(request, accessToken);
      } else {
        return this.schedule(request);
      }
    });
  }

  private buildURL(urlTemplate: string,
      pathParams: { [key: string]: any } | undefined): string {
    let fullURL = this.configuration.url;
    // Put a / between the base URL and the rest of the route template,
    // if there is no / included with the base
    if (fullURL[fullURL.length - 1] !== '/' && (urlTemplate.length == 0
        || urlTemplate[0] != '/')) {
      fullURL += '/';
    }

    fullURL += urlTemplate;

    return fullURL.replace(/{([\w-]+)}/g, (match: string, key: string) => {
      if (pathParams && pathParams.hasOwnProperty(key)) {
        // Path parameter is provided
        return encodeURIComponent(toPathString(pathParams[key]));
      } else {
        throw new ESIError(ErrorName.CLIENT_ERROR,
            'Required path parameter %s is not assigned', key);
      }
    });
  }

  private buildQueryParams(params: { [key: string]: any } | undefined,
      accessToken: string | undefined): object {
    // defaultOpts includes the user agent if so configured
    let allParams: any = Object.assign({}, this.defaultOpts);

    if (params) {
      for (let p of Object.keys(params)) {
        // This converts everything to strings, including arrays to CSV list
        if (params[p] != null) {
          allParams[p] = toPathString(params[p]);
        }
      }
    }

    if (this.configuration.accessTokenDelivery === 'query' && accessToken) {
      allParams['token'] = accessToken;
    }
    return allParams;
  }

  private buildHeaders(accessToken: string | undefined): object {
    let headers: any = {};
    if (this.configuration.accessTokenDelivery === 'header' && accessToken) {
      headers['Authorization'] = 'Bearer ' + accessToken;
    }
    if (this.configuration.userAgentDelivery === 'header') {
      headers['User-Agent'] = this.configuration.userAgent;
    } else if (this.configuration.userAgentDelivery === 'x-header') {
      headers['X-User-Agent'] = this.configuration.userAgent;
    }

    return headers;
  }

  // Schedule a request with rate limiter, but skip checking cache or caching
  // the response.
  private schedule(request: Request): Promise<any> {
    return this.processRequest(request,
        this.limiter.schedule(r => this._request(r), request));
  }

  // Schedule a request with the rate limiter, but check cache first, and cache
  // the response afterwards
  private scheduleAndCache(request: Request, accessToken: string | undefined) {
    return Promise.resolve().then(() => {
      const key = JSON.stringify(request);
      let cached = this.responseCache.get(key);
      if (accessToken) {
        // Also check the access token cache because it may force a request
        // even if the old response is still otherwise valid
        if (!this.accessTokenCache.get(accessToken)) {
          // Token has expired, so skip the cached response if there was one
          cached = undefined;
        }
      }

      if (cached) {
        // A successful request (Promise resolving directly to a value), a
        // failed request (an ESIError that must be newly rejected), or a
        // Promise that is still pending
        return cached instanceof ESIError ? Promise.reject(cached) : cached;
      } else {
        // Must make a new request
        let pending = this.processRequest(request,
            this.limiter.schedule(r => this._request(r), request), key,
            accessToken);

        // Store the pending response in the cache without any expiration
        this.responseCache.set(key, pending, 0);
        return pending;
      }
    });
  }

  private processRequest(request: Request,
      response: Promise<SuperAgent.Response>, cacheKey?: string,
      accessToken?: string): Promise<any> {
    return response.then(r => {
      // Update error limits, calculate expiration time of request, and extract
      // body (which is assumed to match the schema of the route's type).
      this.updateErrorRateLimiter(r);

      let expires;
      if (r.status === 201 || r.status === 204) {
        // A request with side effects, so don't cache it since a subsequent
        // request should trigger the same effects
        expires = 0;
      } else {
        expires = Math.min(this.configuration.maxResponseTTL,
            getExpirationTime(r));
      }

      if (cacheKey) {
        // This automatically overwrites now-completed pending promise if
        // expiration is positive, or removes it from the cache if the ttl
        // is less than 0.
        this.responseCache.set(cacheKey, Promise.resolve(r.body), expires);
      }
      if (accessToken) {
        // Refresh the access token cache
        this.accessTokenCache.set(accessToken, true);
      }

      return r.body;
    })
    .catch(error => {
      // If the error has response information, then use that to update rate
      // limiting
      if (error.response) {
        this.updateErrorRateLimiter(error.response);
      }

      // Wrap the error in a nicer package
      let esiError = getExceptionFromAgentError(error, request);
      if (cacheKey) {
        // Handle processing of the response cache
        //  - The cache implementation automatically saves or deletes the key
        //    if the errorTTL value is positive or negative respectively.
        this.responseCache.set(cacheKey, esiError, this.configuration.errorTTL);
      }
      // Propagate rejection
      throw esiError;
    });
  }

  private updateErrorRateLimiter(response: SuperAgent.Response): void {
    if (this.errorRateLimiter) {
      let remaining = response.get('X-ESI-Error-Limit-Remain');
      let window = response.get('X-ESI-Error-Limit-Reset');

      // Default settings reset the limiter to do nothing
      if (remaining && window) {
        // Headers are defined so parse into numbers
        let remainingCount = +remaining;
        let windowSeconds = +window;

        if (remainingCount < 25) {
          // There have been enough regularly scheduled requests to fail that
          // pressure is on the error limit, so enable extra bottlenecks
          let minTime = Math.max(10, 1000 * windowSeconds / remainingCount);
          this.errorLimiterActive = true;
          this.errorRateLimiter.changeSettings(1, minTime);
        } else if (remainingCount > 75 && this.errorLimiterActive) {
          // Error limit pressure seems to be relieved so disable
          this.errorLimiterActive = false;
          this.errorRateLimiter.changeSettings(0, 0);
        }
      } else if (this.errorLimiterActive) {
        // Presumably the limits have been removed so disable the error limiter
        this.errorLimiterActive = false;
        this.errorRateLimiter.changeSettings(0, 0);
      }
    }
    // Else error rate limiting is disabled by configuration
  }

  private _request(request: Request): Promise<SuperAgent.Response> {
    return Promise.resolve().then(() => {
      return SuperAgent(request.method, request.url)
      .type('application/json')
      .accept('application/json')
      .timeout(this.configuration.timeout)
      .query(request.query)
      .set(request.headers)
      .send(request.body);
    });
  }
}

interface Request {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  headers: object;
  query: object;
  body?: string;
}

// Note that this does not call encodeURIComponent, since this string may be
// included in a url (which needs it), or passed to superagent, which takes
// care of the encoding.
function toPathString(value: any): string {
  if (value === undefined || value == null) {
    return '';
  } else if (value instanceof Date) {
    return value.toISOString();
  } else if (Array.isArray(value)) {
    // Array of arrays have inner elements joined by a pipe
    if (value.length > 0 && Array.isArray(value[0])) {
      let pipedArray = [];
      for (let c of value) {
        pipedArray.push((c as any[]).join('|'));
      }
      return pipedArray.join(',');
    } else {
      // Simple array goes to a CSV
      return value.join(',');
    }
  } else {
    return value.toString();
  }
}

function getExpirationTime(response: SuperAgent.Response): number {
  if (response && response.header && response.header['expires']) {
    let expires = Moment.utc(response.header['expires'],
        'ddd, DD MMM YYYY HH:mm:ss GMT');
    return expires.diff(Moment.utc([]), 'milliseconds', true);
  } else {
    // Default to 5 minutes
    return 300;
  }
}

function getExceptionFromAgentError(error: any, request: Request): ESIError {
  let exception;
  if (error.response) {
    let type = ErrorName.GENERIC_ERROR;
    if (error.status == 404) {
      type = ErrorName.NOT_FOUND_ERROR;
    } else if (error.status == 403 || error.status == 401) {
      type = ErrorName.FORBIDDEN_ERROR;
    } else if (error.statusType == 4) {
      type = ErrorName.CLIENT_ERROR;
    } else if (error.statusType == 5) {
      type = ErrorName.INTERNAL_SERVER_ERROR;
    }

    exception = new ESIError(type, {
          request: request, response: {
            status: error.status,
            headers: error.response.headers,
            body: error.response.text
          }
        }, error.response.error, 'Error from ESI service for %s: %s', request.url,
        error.response.text);
  } else {
    // Some error contacting the service, like a timeout, etc.
    exception = new ESIError(ErrorName.IO_ERROR, { request: request }, error,
        'Error contacting ESI service for %s', request.url);
  }

  return exception;
}
