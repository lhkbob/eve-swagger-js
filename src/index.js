const Api = require('./Api');

let dflt = new Api();
dflt.Api = Api;

/**
 * Exports an instance of {@link Api} with default settings and attaches
 * the Api constructor to it as well if additional configuration must be made.
 *
 * @module eve_swagger_interface
 * @type {Api}
 */
module.exports = dflt;
