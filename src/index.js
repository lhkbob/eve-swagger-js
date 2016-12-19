// Hand-written Promisified wrapper around generated ESI code.
// FIXME make this export a function that takes a swagger URL base and a datasource.

const Promise = require('bluebird');
const Moment = require('moment');
const Cache = require('node-cache');
const ESI = require('../gen/src');

module.exports = function(datasource, baseURL) {
    var exports = {};
    var cache = new Cache({useClones: false});

    if (datasource === undefined) {
        datasource = 'tranquility';
    }

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
     *  authentication 
     */
    var newApi = function(apiCtor, accessToken) {
        // FIXME take into account baseURL
        if (accessToken === undefined) {
            return new apiCtor();
        } else {
            var api = new apiCtor(new ESI.ApiClient());
            api.apiClient.authentications['evesso'].accessToken = accessToken;
            return api;
        }
    };

    /**
     * Create a new object holding the default options/parameters for an ESI 
     * request. Currently this configures the data source to tranquility.
     */
    var defaultOpts = function() {
        return { 'datasource': datasource };
    };

    var getCachedRequest = function(apiCtor, functionName, args, accessToken, 
                                    resolve, reject) {
        var api = newApi(apiCtor, accessToken);
        var _this = this;
        var key = functionName + '/' + args.join(',');
        if (accessToken) {
            key = key + '@' + accessToken;
        }

        var blob = cache.get(key);
        if (blob == undefined) {
            // Request isn't cached any more, so must make the request anew

            // Append the ESI callback function to the arguments array
            var fullArgs = args.slice(0);
            fullArgs.push(defaultOpts());
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

    exports.getCorporation = function(id) {
        return new Promise(function(resolve, reject) {
            getCachedRequest(ESI.CorporationApi, 'getCorporationsCorporationId', 
                             [id], undefined, resolve, reject);
        });
    };

    exports.getCorporationAllianceHistory = function(id) {
        return new Promise(function(resolve, reject) {
            getCachedRequest(ESI.CorporationApi, 
                             'getCorporationsCorporationIdAllianceHistory',
                             [id], undefined, resolve, reject);
        });
    };

    exports.getCorporationIcons = function(id) {
        return new Promise(function(resolve, reject) {
            getCachedRequest(ESI.CorporationApi, 
                             'getCorporationsCorporationIdIcons',
                             [id], undefined, resolve, reject);
        });
    };

    exports.getCorporationMembers = function(id, accessToken) {
        return new Promise(function(resolve, reject) {
            getCachedRequest(ESI.CorporationApi, 
                             'getCorporationsCorporationIdMembers',
                             [id], accessToken, resolve, reject);
        });
    };

    exports.getCorporationRoles = function(id, accessToken) {
        return new Promise(function(resolve, reject) {
            getCachedRequest(ESI.CorporationApi, 
                             'getCorporationsCorporationIdRoles',
                             [id], accessToken, resolve, reject);
        });
    };

    exports.getCorporationNames = function(ids) {
        return new Promise(function(resolve, reject) {
            // The ESI generated code just makes sure ids is not null/undefined,
            // but the actual request mandates at least one ID so we add this
            // pre-check to save time.
            if (ids && !ids.length) {
                throw "At least one corporation id must be provided";
            }
            getCachedRequest(ESI.CorporationApi, 'getCorporationsNames', [ids], 
                             undefined, resolve, reject);
        });
    };

    return exports;
};
