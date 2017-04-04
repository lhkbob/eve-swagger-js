const Agent = require('superagent');
const Bottleneck = require('bottleneck');
const Cache = require('node-cache');
const Moment = require('moment');
const Promise = require('bluebird');
const VError = require('verror');

// FIXME can I use express in testing to parrot back what the request was, and then
// validate that against the swagger.json
// FIXME use hardcoded versions for routes
// FIXME write test that verifies route versions haven't been changed
// FIXME set up continuous integration


const CLIENT_ERROR = 'esi:ClientError';
const FORBIDDEN_ERROR = 'esi:ForbiddenError';
const NOT_FOUND_ERROR = 'esi:NotFoundError';
const INTERNAL_SERVER_ERROR = 'esi:InternalServerError';
const GENERIC_ERROR = 'esi:Error';

// Note that this does not call encodeURIComponent, since this string may be
// included in a url (which needs it), or passed to superagent, which takes
// care of the encoding.
function toPathString(value) {
  if (value === undefined || value == null) {
    return '';
  } else if (value instanceof Date) {
    return value.toISOString();
  } else if (value instanceof Array) {
    // All arrays used in path elements are CSV formatted for ESI
    return value.join(',');
  } else {
    return value.toString();
  }
}

function getExpirationTime(response) {
  if (response && response.header && response.header['expires']) {
    let expires = Moment.utc(response.header['expires'],
        'ddd, DD MMM YYYY HH:mm:ss GMT');
    return expires.diff(Moment.utc([]), 'seconds', true);
  } else {
    // Default to 5 minutes
    return 300;
  }
}

function getExceptionFromAgentError(error, fullURL) {
  let exception;
  if (error.response) {
    let type = GENERIC_ERROR;
    if (error.status == 404) {
      type = NOT_FOUND_ERROR;
    } else if (error.status == 403 || error.status == 401) {
      type = FORBIDDEN_ERROR;
    } else if (error.statusType == 4) {
      type = CLIENT_ERROR;
    } else if (error.statusType == 5) {
      type = INTERNAL_SERVER_ERROR;
    }

    exception = new VError({
      name: type,
      cause: error.response.error
    }, 'Error from ESI service for %s: %s', fullURL, error.response.text);
  } else {
    // Some error contacting the service, like a timeout, etc.
    exception = new VError({
      name: GENERIC_ERROR,
      cause: error
    }, 'Error contacting ESI service for %s', fullURL);
  }

  return exception;
}

class ESIRequestHandler {
  constructor(agent, token = '') {
    this._agent = agent;
    this._token = token;
    this._requestCache = new Cache({
      useClones: false,
      stdTTL: 300
    });
  }

  _buildURL(url, pathParams) {
    let fullURL = this._agent._eveURL;
    if (url.length == 0 || url[0] != '/') {
      fullURL += '/';
    }

    fullURL += url;

    return fullURL.replace(/\{([\w-]+)}/g, (match, key) => {
      if (pathParams && pathParams.hasOwnProperty(key)) {
        // Path parameter is provided
        return encodeURIComponent(toPathString(pathParams[key]));
      } else {
        throw new VError({ name: CLIENT_ERROR }, 'Required path parameter %s is not assigned', key);
      }
    });
  }

  _buildQueryParams(params) {
    let allParams = Object.assign({}, this._agent._defaultOpts);

    if (params) {
      for (let p of Object.keys(params)) {
        // This converts everything to strings, including arrays to CSV list
        allParams[p] = toPathString(params[p]);
      }
    }
    return allParams;
  }

  _schedule(method, url, pathParams, queryParams, body) {
    return Promise.try(() => {
      let fullURL = this._buildURL(url, pathParams);

      // Use stringify on query params and body to get a key specific to the
      // request arguments. Don't bother including default query params since
      // all requests will have those.
      let key = method + ' ' + fullURL + '/' + JSON.stringify(queryParams) + '+'
          + JSON.stringify(body);

      let cached = this._requestCache.get(key);
      if (cached) {
        // A successful request (non-Promise value) or a pending Promise
        return cached;
      } else {
        // Must make a new request
        let pending = this._agent._limiter.schedule(
            () => this._request(method, fullURL, queryParams, body))
        .then(response => {
          // Extract the response body and expiration for cache control
          let expires = getExpirationTime(response);
          let data = response.body || {};
          this._requestCache.set(key, data, expires);
          return data;
        })
        .catch(error => {
          if (!(error instanceof VError)) {
            // Throw consistent exception types
            error = new VError({
              name: GENERIC_ERROR,
              cause: error
            });
          }

          // And make sure to clear out the cache
          this._requestCache.del(key);
          throw error;
        });

        // Save into cache without any expiration so it exists until
        // the request completes or times out
        this._requestCache.set(key, pending, 0);

        return pending;
      }
    });
  }

  _request(method, url, query, body) {
    return Promise.try(() => {
      // Must make a request via superagent
      let request = Agent(method, url);
      request.type('application/json').accept('application/json');
      request.query(this._buildQueryParams(query));
      if (body != null) {
        request.send(body);
      }

      // Handle OAuth SSO
      if (this._token != '') {
        request.set({ 'Authorization': 'Bearer ' + this._token });
      }
      // User-Agent (but use X-User-Agent (which CCP accepts) so it works in
      // browsers)
      request.set('X-User-Agent', this._agent._userAgent);
      // Timeout
      request.timeout(this._agent._timeout);

      return new Promise((resolve, reject) => {
        request.end((error, response) => {
          if (error) {
            // Errors caught here are response errors from agent, so remap them
            // to a cleaner VError.
            reject(getExceptionFromAgentError(error, url));
          } else {
            resolve(response);
          }
        });
      });
    });
  }

  get(url, { path: path = null, query: query = null } = {}) {
    return this._schedule('GET', url, path, query, null);
  }

  put(url, { path: path = null, query: query = null, body: body = null } = {}) {
    return this._schedule('PUT', url, path, query, body);
  }

  post(url,
      { path: path = null, query: query = null, body: body = null } = {}) {
    return this._schedule('POST', url, path, query, body);
  }

  del(url, { path: path = null, query: query = null } = {}) {
    return this._schedule('DELETE', url, path, query, null);
  }
}

// FIXME add cache options as well (default timeout and disable caching)
// Perhaps we can split it into { service: {url, source, agent, language, timeout}, cache: { ... }, rateLimit: { } }
class ESIAgent {
  /**
   * Create a new ESIAgent with the given configuration provided in a single
   * object map. If no argument is provided, the defaults are used.
   *
   * @param service {String} URL to the ESI service
   * @param source {String} Data source used
   * @param agent {String} Custom user agent string to send with each request
   * @param language {String} Language character code
   * @param timeout {Number} Request timeout in milliseconds
   * @param maxConcurrent {Number} Maximum number of requests running at once
   * @param minTime {Number} Minimum time before launching another request (in
   *     milliseconds)
   * @constructor
   */
  constructor({
      service: service, source: source, agent: agent, language: language, timeout: timeout, maxConcurrent: maxConcurrent, minTime: minTime
  } = {}) {
    // Save URL, agent, and timeout for later as they configure the ApiClient
    this._eveURL = service;
    this._userAgent = agent;
    this._timeout = timeout;

    this._defaultOpts = {
      'datasource': source,
      'language': language
    };

    this._limiter = new Bottleneck(maxConcurrent, minTime, -1, Bottleneck.strategy.LEAK, true);

    // Keyed on access token, returns an ESIRequestHandler instance
    this._handlerCache = new Cache({
      useClones: false,
      stdTTL: 300
    });
    this._noAuthHandler = new ESIRequestHandler(this);
  }

  get noAuth() {
    return this._noAuthHandler;
  }

  auth(token) {
    let handler = this._handlerCache.get(token);
    if (!handler) {
      handler = new ESIRequestHandler(this, token);
      this._handlerCache.set(token, handler);
    }
    return handler;
  }
}

/*
z
 {
 service: service = 'https://esi.tech.ccp.is/latest', source: source = 'tranquility', agent: agent = 'eve-swagger-js / https://github.com/lhkbob/eve-swagger-js', language: language = 'en-us', timeout: timeout = 6000
 } = {}

let esi = new ESIAgent({
  service: 'https://esi.tech.ccp.is/latest',
  source: 'tranquility',
  agent: 'test',
  language: 'en-us',
  timeout: 5000,
  maxConcurrent: 1,
  minTime: 5000
});

esi.noAuth.get('/characters/{id}/', { path: { id: 92755159 } })
.then(response => {
  console.log('1a', response);
  return esi.noAuth.get('/characters/{id}/', { path: { id: 92755159 } })
  .then(response => {
    console.log('1b', response);
  }).catch(error => {
    console.error('1be', error.message);
  })
}).catch(error => {
  console.error('1ae', error.message);
}).then(() => {
  console.log('whats up?');
});

esi.noAuth.get('/characters/{id}/', { path: { id: 92755158 } })
.then(response => {
  console.log('2a', response);
  return esi.noAuth.get('/characters/{id}/', { path: { id: 92755158 } })
  .then(response => {
    console.log('2b', response);
  }).catch(error => {
    console.error('2be', error.message);
  })
}).catch(error => {
  console.error('2ae', error.message);
});
    */

module.exports = ESIAgent;
