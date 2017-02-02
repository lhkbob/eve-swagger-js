const Cache = require('node-cache');
const Moment = require('moment');
const Promise = require('bluebird');

const ESI = require('../../generated/src');


/**
 * Get a cached ApiClient instance configured via `provider` and use the
 * given SSO `accessToken`. If `accessToken` is provided, the ApiClient will
 * only be cached for a limited time before it is deleted from the cache to help
 * with automated clean up of access tokens.
 *
 * @param provider {ApiProvider} The api configuration provider
 * @param accessToken {String} Optional; the character access token
 * @return {ApiClient}
 * @memberOf ApiProvider
 * @private
 */
function getApiClient(provider, accessToken = '') {
  let client = provider._apiCache.get(accessToken);
  if (!client) {
    // Must create a new ApiClient for the eveURL + token
    client = new ESI.ApiClient();

    let ttl = 0; // By default don't expire the client
    if (accessToken && accessToken != '') {
      // Insert access token and change it so the client expires
      client.authentications['evesso'].accessToken = accessToken;
      ttl = 3600; // 1 hour
    }

    // Set other configuration options on the client from provider
    client.basePath = provider._eveURL.replace(/\/+$/, '');
    client.defaultHeaders = { 'User-Agent': provider._userAgent };
    client.timeout = provider._timeout;

    provider._apiCache.set(accessToken, client, ttl);
  }

  return client;
}

/**
 * Get a cached ESI API instance, where the API is specified by `apiName`, which
 * must correspond to one of the types in `generated/src/api` module.
 *
 * @param provider {ApiProvider} The api configuration provider
 * @param apiName {String} The name of the API to get
 * @param accessToken {String} Optional; the character access token
 * @returns {*} An instance of ESI[apiName]
 * @memberOf ApiProvider
 * @private
 */
function getApi(provider, apiName, accessToken) {
  let apiClient = getApiClient(provider, accessToken);
  if (!apiClient.hasOwnProperty(apiName)) {
    // Make a new type specific API and attach it to the ApiClient for later use
    let api = new ESI[apiName](apiClient);

    // Attach a cache to the created instance
    api._requestCache = new Cache({ useClones: false });

    apiClient[apiName] = api;
    return api;
  } else {
    return apiClient[apiName];
  }
}

/**
 * Invoke the function, `functionName` on `api` if an http request must actually
 * be made. The function will be invoked with `args`, which must be an array of
 * arguments as you'd pass to `Function.apply()`. `opts` is used as the last
 * argument after the end of `args`.
 *
 * This will cache data and error responses, where the cache time is based on
 * the "expires" header in the http response.
 *
 * `resolve` and `reject` must be Promise handler functions, as provided by
 * the Promise constructor.
 *
 * @param {*} api The ESI Api instance to use for the query
 * @param {String} functionName The name of a function callable on this.
 * @param {Array} args Array of arguments to pass to ESI Api function call
 * @param {Object} opts Optional parameter object to pass to the ESI call
 * @param {Function} resolve Promise resolve handler
 * @param {Function} reject Promise error resolution handler
 * @private
 */
function getCachedRequest(api, functionName, args, opts, resolve, reject) {
  let key = functionName + '/' + JSON.stringify(args) + '+' + JSON.stringify(
          opts);

  let cache = api._requestCache;
  let blob = cache.get(key);
  if (blob == undefined) {
    // Request isn't cached any more, so must make the request anew

    // Append the options and callback function to the arguments array
    let fullArgs = args.slice(0);
    fullArgs.push(opts);
    fullArgs.push(function(error, data, response) {
      // Look up all collected resolve/reject handlers in the cache
      let toNotify = cache.get(key);
      try {
        // Set state of cache to received data before resolving
        // promises, with a timeout based on expires header.
        let timeout = 0;
        if (response.header.expires) {
          let expires = Moment.utc(response.header.expires,
              'ddd, DD MMM YYYY HH:mm:ss GMT');
          timeout = expires.diff(Moment.utc([]), 'seconds', true);
        }

        if (error) {
          cache.set(key, { error: error.response.error }, timeout);
          for (let r of toNotify.onReject) {
            r(error.response.error);
          }
        } else {
          // Make sure data isn't null
          data = data || {};
          cache.set(key, { data: data }, timeout);
          for (let r of toNotify.onResolve) {
            r(data);
          }
        }
      } catch (e) {
        // Clear cache so that it can be tried again
        cache.set(key, null);

        // Push the exception caught in the ESI callback to all the
        // registered rejects.
        if (toNotify && toNotify.onReject) {
          for (let r of toNotify.onReject) {
            r(e);
          }
        } else {
          // In this worst case scenario, at least notify the
          // reject handler that was provided initially (will not
          // reject any subsequently cached handlers but that
          // shouldn't happen).
          reject(e);
        }
      }
    });

    // Invoke ESI function
    api[functionName].apply(api, fullArgs);

    // Set in cache after API call, in the event that the API function
    // fails on validation before it gets to the point where it handles
    // the callback which would notify the resolve/reject listeners.
    // - No timeout yet so that this won't expire until ESI request
    //   is completed or times-out on its own
    cache.set(key, {
      onResolve: [resolve],
      onReject: [reject]
    });
  } else if (blob.data) {
    // A previous request has completed successfully, so just invoke
    // the provided resolve.
    resolve(blob.data);
  } else if (blob.error) {
    // A previous request has completed with an error, so just invoke
    // the provided reject.
    reject(blob.error);
  } else {
    // A prior equivalent request has been initiated but hasn't
    // completed, so append the promise handlers to the cache blob.
    blob.onResolve.push(resolve);
    blob.onReject.push(reject);
  }
}

/**
 * Primary access point to invoking specific ESI Api's with the Promise-wrapping
 * `newRequest` function.
 * @private
 */
class PromiseApi {
  /**
   * Create a new PromiseApi that wraps the given ESI `apiType`, configured
   * via `provider` and with optional auth from `accessToken`.
   *
   * @param apiType {String} The ESI Api class to instantiate
   * @param provider {ApiProvider} The api configuration and cache provider
   * @param accessToken {String} The optional SSO access token
   * @constructor
   */
  constructor(apiType, provider, accessToken) {
    this._apiType = apiType;
    this._provider = provider;
    this._accessToken = accessToken;
  }

  /**
   * Create a new Promise for invoking the ESI request represented by `method`,
   * which must be a function on the underlying Api instance. The function is
   * called with arguments in the array, `args`. The `opts` argument is
   * presumed
   * to be an object used as the last argument to the API request, and will be
   * modified to include additional default properties configured by the
   * factory.
   *
   * @param {String} method The name of a function callable on the Api
   *     instance.
   * @param {Array} args Array of arguments to pass to ESI Api function call
   * @param {Object} opts Optional parameters object to pass to the ESI call
   * @return {Promise} A new promise that resolves to the data returned
   *     by the request
   */
  newRequest(method, args, opts = {}) {
    let _this = this;
    return new Promise(function(resolve, reject) {
      // Get an ESi.XApi instance, possibly cached, that is configured to use
      // the provider's config and given access token
      let api = getApi(_this._provider, _this._apiType, _this._accessToken);
      // Form full opts object based on the provider's default options
      opts = Object.assign({}, opts, _this._provider._defaultOpts);
      getCachedRequest(api, method, args, opts, resolve, reject);
    });
  }
}

/**
 * Configuration and factory function for getting Promise-wrapping `PromiseApi`
 * instances for each of the generated ESI Api's.
 * @private
 */
class ApiProvider {
  /**
   * Create a new ApiProvider with the given configuration provided in a single
   * object map. If no argument is provided, the defaults are used.
   *
   * @param service {String} URL to the ESI service
   * @param source {String} Data source used
   * @param agent {String} Custom user agent string to send with each request
   * @param language {String} Language character code
   * @param timeout {Number} Request timeout in milliseconds
   * @constructor
   */
  constructor({
      service: service,
      source: source,
      agent: agent,
      language: language,
      timeout: timeout
  }) {
    // Save URL, agent, and timeout for later as they configure the ApiClient
    this._eveURL = service;
    this._userAgent = agent;
    this._timeout = timeout;

    this._defaultOpts = {
      'datasource': source,
      'language': language,
      'acceptLanguage': language
    };

    // Keyed on access token, returns an ApiClient instance
    this._apiCache = new Cache({ useClones: false });
  }

  /**
   * Create a new PromiseApi.
   *
   * @param accessToken {String} Optional character access token for all
   *     requests.
   * @returns {PromiseApi}
   * @esi_link AllianceApi
   */
  alliance(accessToken = '') {
    return new PromiseApi('AllianceApi', this, accessToken);
  }

  /**
   * Create a new PromiseApi.
   *
   * @param accessToken {String} Optional character access token for all
   *     requests.
   * @returns {PromiseApi}
   * @esi_link AssetsApi
   */
  assets(accessToken = '') {
    return new PromiseApi('AssetsApi', this, accessToken);
  }

  /**
   * Create a new PromiseApi.
   *
   * @param accessToken {String} Optional character access token for all
   *     requests.
   * @returns {PromiseApi}
   * @esi_link BookmarksApi
   */
  bookmarks(accessToken = '') {
    return new PromiseApi('BookmarksApi', this, accessToken);
  }

  /**
   * Create a new PromiseApi.
   *
   * @param accessToken {String} Optional character access token for all
   *     requests.
   * @returns {PromiseApi}
   * @esi_link CalendarApi
   */
  calendar(accessToken = '') {
    return new PromiseApi('CalendarApi', this, accessToken);
  }

  /**
   * Create a new PromiseApi.
   *
   * @param accessToken {String} Optional character access token for all
   *     requests.
   * @returns {PromiseApi}
   * @esi_link CharacterApi
   */
  character(accessToken = '') {
    return new PromiseApi('CharacterApi', this, accessToken);
  }

  /**
   * Create a new PromiseApi.
   *
   * @param accessToken {String} Optional character access token for all
   *     requests.
   * @returns {PromiseApi}
   * @esi_link ClonesApi
   */
  clones(accessToken = '') {
    return new PromiseApi('ClonesApi', this, accessToken);
  }

  /**
   * Create a new PromiseApi.
   *
   * @param accessToken {String} Optional character access token for all
   *     requests.
   * @returns {PromiseApi}
   * @esi_link ContactsApi
   */
  contacts(accessToken = '') {
    return new PromiseApi('ContactsApi', this, accessToken);
  }

  /**
   * Create a new PromiseApi.
   *
   * @param accessToken {String} Optional character access token for all
   *     requests.
   * @returns {PromiseApi}
   * @esi_link CorporationApi
   */
  corporation(accessToken = '') {
    return new PromiseApi('CorporationApi', this, accessToken);
  }

  /**
   * Create a new PromiseApi.
   *
   * @param accessToken {String} Optional character access token for all
   *     requests.
   * @returns {PromiseApi}
   * @esi_link FittingsApi
   */
  fittings(accessToken = '') {
    return new PromiseApi('FittingsApi', this, accessToken);
  }

  /**
   * Create a new PromiseApi.
   *
   * @param accessToken {String} Optional character access token for all
   *     requests.
   * @returns {PromiseApi}
   * @esi_link FleetsApi
   */
  fleets(accessToken = '') {
    return new PromiseApi('FleetsApi', this, accessToken);
  }

  /**
   * Create a new PromiseApi.
   *
   * @param accessToken {String} Optional character access token for all
   *     requests.
   * @returns {PromiseApi}
   * @esi_link IncursionsApi
   */
  incursions(accessToken = '') {
    return new PromiseApi('IncursionsApi', this, accessToken);
  }

  /**
   * Create a new PromiseApi.
   *
   * @param accessToken {String} Optional character access token for all
   *     requests.
   * @returns {PromiseApi}
   * @esi_link IndustryApi
   */
  industry(accessToken = '') {
    return new PromiseApi('IndustryApi', this, accessToken);
  }

  /**
   * Create a new PromiseApi.
   *
   * @param accessToken {String} Optional character access token for all
   *     requests.
   * @returns {PromiseApi}
   * @esi_link InsuranceApi
   */
  insurance(accessToken = '') {
    return new PromiseApi('InsuranceApi', this, accessToken);
  }

  /**
   * Create a new PromiseApi.
   *
   * @param accessToken {String} Optional character access token for all
   *     requests.
   * @returns {PromiseApi}
   * @esi_link KillmailsApi
   */
  killmails(accessToken = '') {
    return new PromiseApi('AssetsApi', this, accessToken);
  }

  /**
   * Create a new PromiseApi.
   *
   * @param accessToken {String} Optional character access token for all
   *     requests.
   * @returns {PromiseApi}
   * @esi_link LocationApi
   */
  location(accessToken = '') {
    return new PromiseApi('LocationApi', this, accessToken);
  }

  /**
   * Create a new PromiseApi.
   *
   * @param accessToken {String} Optional character access token for all
   *     requests.
   * @returns {PromiseApi}
   * @esi_link MailApi
   */
  mail(accessToken = '') {
    return new PromiseApi('MailApi', this, accessToken);
  }

  /**
   * Create a new PromiseApi.
   *
   * @param accessToken {String} Optional character access token for all
   *     requests.
   * @returns {PromiseApi}
   * @esi_link MarketApi
   */
  market(accessToken = '') {
    return new PromiseApi('MarketApi', this, accessToken);
  }

  /**
   * Create a new PromiseApi.
   *
   * @param accessToken {String} Optional character access token for all
   *     requests.
   * @returns {PromiseApi}
   * @esi_link PlanetaryInteractionApi
   */
  planetaryInteraction(accessToken = '') {
    return new PromiseApi('PlanetaryInteractionApi', this, accessToken);
  }

  /**
   * Create a new PromiseApi.
   *
   * @param accessToken {String} Optional character access token for all
   *     requests.
   * @returns {PromiseApi}
   * @esi_link SearchApi
   */
  search(accessToken = '') {
    return new PromiseApi('SearchApi', this, accessToken);
  }

  /**
   * Create a new PromiseApi.
   *
   * @param accessToken {String} Optional character access token for all
   *     requests.
   * @returns {PromiseApi}
   * @esi_link SkillsApi
   */
  skills(accessToken = '') {
    return new PromiseApi('SkillsApi', this, accessToken);
  }

  /**
   * Create a new PromiseApi.
   *
   * @param accessToken {String} Optional character access token for all
   *     requests.
   * @returns {PromiseApi}
   * @esi_link SovereigntyApi
   */
  sovereignty(accessToken = '') {
    return new PromiseApi('SovereigntyApi', this, accessToken);
  }

  /**
   * Create a new PromiseApi.
   *
   * @param accessToken {String} Optional character access token for all
   *     requests.
   * @returns {PromiseApi}
   * @esi_link UniverseApi
   */
  universe(accessToken = '') {
    return new PromiseApi('UniverseApi', this, accessToken);
  }

  /**
   * Create a new PromiseApi.
   *
   * @param accessToken {String} Optional character access token for all
   *     requests.
   * @returns {PromiseApi}
   * @esi_link UserInterfaceApi
   */
  userInterface(accessToken = '') {
    return new PromiseApi('UserInterfaceApi', this, accessToken);
  }

  /**
   * Create a new PromiseApi.
   *
   * @param accessToken {String} Optional character access token for all
   *     requests.
   * @returns {PromiseApi}
   * @esi_link WalletApi
   */
  wallet(accessToken = '') {
    return new PromiseApi('WalletApi', this, accessToken);
  }

  /**
   * Create a new PromiseApi.
   *
   * @param accessToken {String} Optional character access token for all
   *     requests.
   * @returns {PromiseApi}
   * @esi_link WarsApi
   */
  wars(accessToken = '') {
    return new PromiseApi('WarsApi', this, accessToken);
  }
}

module.exports = ApiProvider;
