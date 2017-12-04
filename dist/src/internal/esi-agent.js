"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bottleneck_1 = require("bottleneck");
const SuperAgent = require("superagent");
const Moment = require("moment");
const esi_1 = require("../esi");
const error_1 = require("../error");
const cache_1 = require("./cache");
/**
 * ESIAgent is a low-level request handler for making HTTP requests to the ESI
 * service. It internally manages a response cache, an access token cache,
 * generic rate limiting, and can respect the error rate limiting imposed by the
 * service. This should not be used directly, but is called by the higher level
 * API functions. These functions package up the required route parameters,
 * route ID, and potentially filter the response type to a cleaner
 * representation.
 */
class ESIAgent {
    /**
     * Create a new ESIAgent with the given configuration for the service,
     * rate limiting, and caching behaviors managed by the agent.
     *
     * @param configuration The configuration of the agent
     * @constructor
     */
    constructor(configuration) {
        this.configuration = configuration;
        let options = {
            'datasource': configuration.source, 'language': configuration.language
        };
        if (configuration.userAgentDelivery === 'query') {
            options['user_agent'] = this.configuration.userAgent;
        }
        this.defaultOpts = options;
        this.limiter = new bottleneck_1.default(configuration.maxConcurrentRequests, configuration.minTimeBetweenRequests, configuration.maxQueueSize, bottleneck_1.default.strategy.LEAK, /* reject leaked jobs */ true);
        if (configuration.respectErrorLimit) {
            this.errorRateLimiter = new bottleneck_1.default(0, 0, -1, bottleneck_1.default.strategy.LEAK, false);
            this.limiter.chain(this.errorRateLimiter);
        }
        else {
            this.errorRateLimiter = undefined;
        }
        this.errorLimiterActive = false;
        this.responseCache = new cache_1.default(this.configuration.maxResponseTTL);
        this.accessTokenCache = new cache_1.default(this.configuration.accessTokenTTL);
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
    request(route, parameters, accessToken) {
        return Promise.resolve().then(() => {
            const config = esi_1.ROUTE_MAP[route];
            const pathArgs = parameters ? parameters.path : undefined;
            const queryArgs = parameters ? parameters.query : undefined;
            const body = parameters ? parameters.body : undefined;
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
            }
            else {
                return this.schedule(request);
            }
        });
    }
    buildURL(urlTemplate, pathParams) {
        let fullURL = this.configuration.url;
        // Put a / between the base URL and the rest of the route template,
        // if there is no / included with the base
        if (fullURL[fullURL.length - 1] !== '/' && (urlTemplate.length == 0
            || urlTemplate[0] != '/')) {
            fullURL += '/';
        }
        fullURL += urlTemplate;
        return fullURL.replace(/{([\w-]+)}/g, (match, key) => {
            if (pathParams && pathParams.hasOwnProperty(key)) {
                // Path parameter is provided
                return encodeURIComponent(toPathString(pathParams[key]));
            }
            else {
                throw new error_1.ESIError("esi:ClientError" /* CLIENT_ERROR */, 'Required path parameter %s is not assigned', key);
            }
        });
    }
    buildQueryParams(params, accessToken) {
        // defaultOpts includes the user agent if so configured
        let allParams = Object.assign({}, this.defaultOpts);
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
    buildHeaders(accessToken) {
        let headers = {};
        if (this.configuration.accessTokenDelivery === 'header' && accessToken) {
            headers['Authorization'] = 'Bearer ' + accessToken;
        }
        if (this.configuration.userAgentDelivery === 'header') {
            headers['User-Agent'] = this.configuration.userAgent;
        }
        else if (this.configuration.userAgentDelivery === 'x-header') {
            headers['X-User-Agent'] = this.configuration.userAgent;
        }
        return headers;
    }
    // Schedule a request with rate limiter, but skip checking cache or caching
    // the response.
    schedule(request) {
        return this.processRequest(request, this.limiter.schedule(r => this._request(r), request));
    }
    // Schedule a request with the rate limiter, but check cache first, and cache
    // the response afterwards
    scheduleAndCache(request, accessToken) {
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
                return cached instanceof error_1.ESIError ? Promise.reject(cached) : cached;
            }
            else {
                // Must make a new request
                let pending = this.processRequest(request, this.limiter.schedule(r => this._request(r), request), key, accessToken);
                // Store the pending response in the cache without any expiration
                this.responseCache.set(key, pending, 0);
                return pending;
            }
        });
    }
    processRequest(request, response, cacheKey, accessToken) {
        return response.then(r => {
            // Update error limits, calculate expiration time of request, and extract
            // body (which is assumed to match the schema of the route's type).
            this.updateErrorRateLimiter(r);
            let expires;
            if (r.status === 201 || r.status === 204) {
                // A request with side effects, so don't cache it since a subsequent
                // request should trigger the same effects
                expires = 0;
            }
            else {
                expires = Math.min(this.configuration.maxResponseTTL, getExpirationTime(r));
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
    updateErrorRateLimiter(response) {
        if (this.errorRateLimiter) {
            let remaining = response.get('X-ESI-Error-Limit-Remain');
            let window = response.get('X-ESI-Error-Limit-Reset');
            // Default settings reset the limiter to do nothing
            if (remaining && window) {
                // Headers are defined so parse into numbers
                let remainingCount = +remaining;
                let windowSeconds = +window;
                if (remainingCount < 50) {
                    // There have been enough regularly scheduled requests to fail that
                    // pressure is on the error limit, so enable extra bottlenecks
                    let minTime;
                    if (remainingCount > 0) {
                        minTime = 1.5 * Math.max(10, 1000 * windowSeconds / remainingCount);
                    }
                    else {
                        // rate limiting wasn't successful and the global error response
                        // has been triggered, so just wait until the window has elapsed
                        minTime = 2 * 1000 * windowSeconds;
                    }
                    this.errorLimiterActive = true;
                    this.errorRateLimiter.changeSettings(1, minTime);
                }
                else if (remainingCount > 85 && this.errorLimiterActive) {
                    // Error limit pressure seems to be relieved so disable
                    this.errorLimiterActive = false;
                    this.errorRateLimiter.changeSettings(0, 0);
                }
            }
            else if (this.errorLimiterActive) {
                // Presumably the limits have been removed so disable the error limiter
                this.errorLimiterActive = false;
                this.errorRateLimiter.changeSettings(0, 0);
            }
        }
        // Else error rate limiting is disabled by configuration
    }
    _request(request) {
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
exports.ESIAgent = ESIAgent;
// Note that this does not call encodeURIComponent, since this string may be
// included in a url (which needs it), or passed to superagent, which takes
// care of the encoding.
function toPathString(value) {
    if (value === undefined || value == null) {
        return '';
    }
    else if (value instanceof Date) {
        return value.toISOString();
    }
    else if (Array.isArray(value)) {
        // Array of arrays have inner elements joined by a pipe
        if (value.length > 0 && Array.isArray(value[0])) {
            let pipedArray = [];
            for (let c of value) {
                pipedArray.push(c.join('|'));
            }
            return pipedArray.join(',');
        }
        else {
            // Simple array goes to a CSV
            return value.join(',');
        }
    }
    else {
        return value.toString();
    }
}
function getExpirationTime(response) {
    if (response && response.header && response.header['expires']) {
        let expires = Moment.utc(response.header['expires'], 'ddd, DD MMM YYYY HH:mm:ss GMT');
        return expires.diff(Moment.utc([]), 'milliseconds', true);
    }
    else {
        // Default to 5 minutes
        return 300;
    }
}
function getExceptionFromAgentError(error, request) {
    let exception;
    if (error.response) {
        let type = "esi:Error" /* GENERIC_ERROR */;
        if (error.status == 404) {
            type = "esi:NotFoundError" /* NOT_FOUND_ERROR */;
        }
        else if (error.status == 403 || error.status == 401) {
            type = "esi:ForbiddenError" /* FORBIDDEN_ERROR */;
        }
        else if (error.statusType == 4) {
            type = "esi:ClientError" /* CLIENT_ERROR */;
        }
        else if (error.statusType == 5) {
            type = "esi:InternalServerError" /* INTERNAL_SERVER_ERROR */;
        }
        exception = new error_1.ESIError(type, {
            request: request, response: {
                status: error.status,
                headers: error.response.headers,
                body: error.response.text
            }
        }, error.response.error, 'Error from ESI service for %s: %s', request.url, error.response.text);
    }
    else {
        // Some error contacting the service, like a timeout, etc.
        exception = new error_1.ESIError("esi:IOError" /* IO_ERROR */, { request: request }, error, 'Error contacting ESI service for %s', request.url);
    }
    return exception;
}
//# sourceMappingURL=esi-agent.js.map