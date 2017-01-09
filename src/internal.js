/**
 * Internal code to handle caching and promisification of generated ESI client.
 * @module internal
 * @private
 */

/**
 * A Bluebird JS Promise.
 * @external Promise
 * @see http://bluebirdjs.com
 */

const Promise = require('bluebird');
const Moment = require('moment');
const Cache = require('node-cache');
const ESI = require('../generated/src');

module.exports = function(opts) {
    var cache = new Cache({useClones: false});
    var defaultBaseURL = 'https://esi.tech.ccp.is/latest';

    opts = opts || {};
    if (opts.datasource === undefined) {
        opts.datasource = 'tranquility';
    }
    if (opts.language === undefined) {
        opts.language = 'en';
    }
    if (opts.baseURL === undefined) {
        opts.baseURL = defaultBaseURL;
    }
    if (opts.accessToken === undefined) {
        opts.accessToken = null;
    }

    var exports = {};

    /**
     * The options provided to the factory function.
     */
    exports.opts = opts;

    /**
     * The swagger-codegen ESI module.
     */
    exports.esi = ESI;

    /**
     * Create a new ESI Api instance based on the given Ctor. If `accessToken`
     * is not undefined, the new Api is also created with a new ApiClient 
     * instance  configured to use 'evesso' authentication with the given token.
     *
     * A new Api must be created for each request since the authentications data
     * is otherwise persistent, resulting in race conditions when multiple 
     * requests need to be made with different tokens.
     *
     * @param {Constructor} apiCtor One of the ESI.xyzApi constructor functions
     * @param {String} accessToken Optional Eve SSO access token for 
     *   authentication 
     * @return A new Api instance
     */
    var newApi = function(apiCtor, accessToken) {
        var api;
        accessToken = accessToken || opts.accessToken;
        if (accessToken) {
            api = new apiCtor(new ESI.ApiClient());
            api.apiClient.authentications['evesso'].accessToken = accessToken;
        } else {
            api = new apiCtor();
        }

        // Hack in a new baseURL, which is hardcoded in the swagger-codegen lib
        if (opts.baseURL != defaultBaseURL) {
            api.apiClient.basePath = opts.baseURL.replace(/\/+$/, '');
        }
        return api;
    };

    /**
     * Create a new object holding the default options/parameters for an ESI 
     * request. Currently this configures the data source to tranquility and 
     * sets the default accept language.
     *
     * @return {Object} The default options
     */
    var defaultOpts = function() {
        return { 'datasource': opts.datasource, 
                 'acceptLanguage': opts.language };
    };

    /**
     * Invoke the function, `functionName`, on an Api instance to be created by
     * `apiCtor` if an http request must actually be made. The function will be
     * invoked with `args`, which must be an array of arguments as you'd pass
     * to `Function.apply()`. If `accessToken` is not undefined it will be used
     * as the EVE SSO token for authentication.
     * 
     * This will cache data and error responses, where the cache time is 
     * based on the "expires" header in the http response. 
     *
     * `resolve` and `reject` must be Promise handler functions, as provided by
     * the Promise constructor.
     *
     * @param {Constructor} apiCtor One of the ESI.xyzApi constructor functions
     * @param {String} functionName The name of a function callable on the 
     *   Api instance created by `apiCtor`.
     * @param {Array} args Array of arguments to pass to ESI Api function call
     * @param {Object} opts Optional parameter object to pass to the ESI call
     * @param {String} accessToken Optional access token to use for 
     *   authentication, pass `undefined` if not needed
     * @param {Function} resolve Promise resolve handler
     * @param {Function} reject Promise error resolution handler
     */
    var getCachedRequest = function(apiCtor, functionName, args, opts, 
                                    accessToken, resolve, reject) {
        // Make options not null
        opts = opts || {};

        var _this = this;
        var key = functionName + '/' + JSON.stringify(args) + '+' + JSON.stringify(opts);
        if (accessToken) {
            key = key + '@' + accessToken;
        }

        var blob = cache.get(key);
        if (blob == undefined) {
            // Request isn't cached any more, so must make the request anew

            // Append the ESI callback function to the arguments array
            var fullArgs = args.slice(0);
            fullArgs.push(Object.assign(defaultOpts(), opts));
            fullArgs.push(function(error, data, response) {
                // Look up all collected resolve/reject handlers in the cache
                var toNotify = cache.get(key);
                try {
                    // Set state of cache to received data before resolving 
                    // promises, with a timeout based on expires header.
                    var timeout = 0;
                    if (response.header.expires) {
                        var expires = Moment.utc(response.header.expires, 
                            'ddd, DD MMM YYYY HH:mm:ss GMT');
                        timeout = expires.diff(Moment.utc([]), 'seconds', true);
                    } 
                
                    if (error) {
                        cache.set(key, {error: error.response.error}, timeout);
                        for (r in toNotify.onReject) {
                            toNotify.onReject[r].apply(_this, 
                                                       [error.response.error]);
                        }
                    } else {
                        // Make sure data isn't null
                        data = data || {};
                        cache.set(key, {data: data}, timeout);
                        for (r in toNotify.onResolve) {
                            toNotify.onResolve[r].apply(_this, [data]);
                        }
                    }
                } catch(e) {
                    // Push the exception caught in the ESI callback to all the
                    // registered rejects.
                    if (toNotify && toNotify.onReject) {
                        for (r in toNotify.onReject) {
                            toNotify.onReject[r].apply(_this, e);
                        }
                    } else {
                        // In this worst case scenario, at least notify the 
                        // reject handler that was provided initially (will not 
                        // reject any subsequently cached handlers but that 
                        // shouldn't happen).
                        reject.apply(_this, e);
                    }
                }
            });
            // Invoke ESI function
            var api = newApi(apiCtor, accessToken);
            api[functionName].apply(api, fullArgs);

            // Set in cache after API call, in the event that the API function
            // fails on validation before it gets to the point where it handles
            // the callback which would notify the resolve/reject listeners.
            // - No timeout yet so that this won't expire until ESI request
            //   is completed or times-out on its own
            cache.set(key, { onResolve: [resolve], onReject: [reject] });
        } else if (blob.data) {
            // A previous request has completed successfully, so just invoke 
            // the provided resolve.
            resolve.apply(_this, [blob.data]);
        } else if (blob.error) {
            // A previous request has completed with an error, so just invoke 
            // the provided reject.
            reject.apply(_this, [blob.error]);
        } else {
            // A prior equivalent request has been initiated but hasn't 
            // completed, so append the promise handlers to the cache blob.
            blob.onResolve.push(resolve);
            blob.onReject.push(reject);
        }
    };

    /**
     * Create a new Promise for invoking the ESI request described by the
     * Api constructor, `apiCtor`, the function `functionName`, and arguments
     * stored in the array, `args`. If `accessToken` is defined then it will
     * be used for SSO authentication.
     *
     * @param {Constructor} apiCtor One of the ESI.xyzApi constructor functions
     * @param {String} functionName The name of a function callable on the 
     *   Api instance created by `apiCtor`.
     * @param {Array} args Array of arguments to pass to ESI Api function call
     * @param {String} accessToken Optional access token to use for 
     *   authentication, pass `undefined` if not needed
     * @return A new promise that resolves to the data returned by the request
     */
    exports.newRequest = function(apiCtor, functionName, args, accessToken) {
        return new Promise(function(resolve, reject) {
            getCachedRequest.apply(this, [apiCtor, functionName, args, null,
                                   accessToken, resolve, reject]);
        });
    };

    /**
     * Create a new Promise for invoking the ESI request described by the
     * Api constructor, `apiCtor`, the function `functionName`, and arguments
     * stored in the array, `args`. If `accessToken` is defined then it will
     * be used for SSO authentication. The `opts` argument is presumed to be
     * an object suitable for the API request, and will be modified to include
     * additional default properties configured by the factory.
     *
     * @param {Constructor} apiCtor One of the ESI.xyzApi constructor functions
     * @param {String} functionName The name of a function callable on the 
     *   Api instance created by `apiCtor`.
     * @param {Array} args Array of arguments to pass to ESI Api function call
     * @param {Object} opts Optional parameters object to pass to the ESI call
     * @param {String} accessToken Optional access token to use for 
     *   authentication, pass `undefined` if not needed
     * @return A new promise that resolves to the data returned by the request
     */
    exports.newRequestOpt = function(apiCtor, functionName, args, opts, 
                                     accessToken) {
        return new Promise(function(resolve, reject) {
            getCachedRequest.apply(this, [apiCtor, functionName, args, opts,
                                   accessToken, resolve, reject]);
        });
    };

    return exports;
};
