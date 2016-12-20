
/**
 * Hand-written Promisified wrapper around generated ESI code.
 * This module returns a factory function that takes an optional datasource
 * string and base URL. If any parameter is not provided, the defaults are used.
 *
 * The factory function returns an object with properties that expose 
 * instantiations of each sub-module for the ESI groups.
 *
 * @param {String} datasource The datasource string, defaults to `'tranquility'`
 * @param {String} baseURL The base URL of the ESI Swagger endpoint, which
 *   defaults to `'https://esi.tech.ccp.is/latest'`
 * @module eve_swagger_interface
 */
module.exports = function(datasource, baseURL) {
    var exports = {};
    var internal = require('./internal')(datasource, baseURL);

    /**
     * This is an instance of Corporation module configured to use the
     * datasource and baseURL provided to the factory. This module uses a
     * cache shared by the other APIs exposed by the factory function.
     *
     * @see module:corporation
     */
    exports.Corporation = require('./corporation')(internal);

    return exports;
};
