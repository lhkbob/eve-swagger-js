import { Responses, Parameters, esi } from '../../gen/esi';
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
    language: esi.Language;
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
export declare class ESIAgent {
    readonly configuration: Configuration;
    private defaultOpts;
    private responseCache;
    private accessTokenCache;
    private limiter;
    private errorRateLimiter;
    private errorLimiterActive;
    /**
     * Create a new ESIAgent with the given configuration for the service,
     * rate limiting, and caching behaviors managed by the agent.
     *
     * @param configuration The configuration of the agent
     * @constructor
     */
    constructor(configuration: Configuration);
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
    request<ID extends keyof Responses & keyof Parameters>(route: ID, parameters: Parameters[ID], accessToken?: string): Promise<Responses[ID]>;
    private buildURL(urlTemplate, pathParams);
    private buildQueryParams(params, accessToken);
    private buildHeaders(accessToken);
    private schedule(request);
    private scheduleAndCache(request, accessToken);
    private processRequest(request, response, cacheKey?, accessToken?);
    private updateErrorRateLimiter(response);
    private _request(request);
}
