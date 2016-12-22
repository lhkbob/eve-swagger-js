
/**
 * Hand-written Promisified wrapper around generated ESI code.
 * This module returns a factory function that takes an optional datasource
 * string and base URL. If any parameter is not provided, the defaults are used.
 *
 * The factory function returns an object with properties that expose 
 * instantiations of each sub-module for the ESI groups.
 * 
 * @param {String} opts.accessToken The default access token to provide on all
 *   requests; methods that require authentication provide an optional access 
 *   token argument so that it can be overridden per request. Defaults to `null`
 * @param {String} opts.baseURL The base URL of the ESI endpoint, which defaults
 *   to `'https://esi.tech.ccp.is/latest'`
 * @param {String} opts.datasource The datasource for the ESI endpoint, defaults 
 *   to `'tranquility'`
 * @param {String} opts.language The default language locale code, defaults to
 *   `null`, but can be set to one of {@link eve_swagger_interface:languages languages}.
 *   Requests that support localization provide a language parameter so it can 
 *   be overridden per request.
 * 
 * @module eve_swagger_interface
 */
module.exports = function(opts) {
    var internal = require('./internal')(opts);

    var exports = {};

    /**
     * The enumeration of language codes that functions that provide 
     * localization support.
     *
     * @constant {Array.<String>}
     */
    exports.languages = [ 'de', 'en', 'fr', 'ja', 'ru', 'zh' ];

    /**
     * This is an instance of `alliance` module configured to use the
     * options provided to the factory. This instance uses a cache shared by the 
     * other exposed APIs members.
     *
     * @constant {module:alliance}
     */
    exports.alliance = require('./alliance')(internal);

    /**
     * This is an instance of `corporation` module configured to use the
     * options provided to the factory. This instance uses a cache shared by the 
     * other exposed APIs members.
     *
     * @constant {module:corporation}
     */
    exports.corporation = require('./corporation')(internal);

    /**
     * This is an instance of `fleets` module configured to use the
     * options provided to the factory. This instance uses a cache shared by the 
     * other exposed APIs members.
     *
     * @constant {module:fleets}
     */
    exports.fleets = require('./fleets')(internal);

    /**
     * This is an instance of `incursions` module configured to use the
     * options provided to the factory. This instance uses a cache shared by the
     * other exposed APIs members.
     *
     * @constant {module:incursions}
     */
    exports.incursions = require('./incursions')(internal);

    /**
     * This is an instance of `industry` module configured to use the
     * options provided to the factory. This instance uses a cache shared by the
     * other exposed APIs members.
     *
     * @constant {module:industry}
     */
    exports.industry = require('./industry')(internal);

    /**
     * This is an instance of `insurance` module configured to use the
     * options provided to the factory. This instance uses a cache shared by the
     * other exposed APIs members.
     *
     * @constant {module:insurance}
     */
    exports.insurance = require('./insurance')(internal);

    /**
     * This is an instance of `killmails` module configured to use the
     * options provided to the factory. This instance uses a cache shared by the
     * other exposed APIs members.
     *
     * @constant {module:killmails}
     */
    exports.killmails = require('./killmails')(internal);

    /**
     * This is an instance of `market` module configured to use the
     * options provided to the factory. This instance uses a cache shared by the
     * other exposed APIs members.
     *
     * @constant {module:market}
     */
    exports.market = require('./market')(internal);

    /**
     * This is an instance of `sovereignty` module configured to use the
     * options provided to the factory. This instance uses a cache shared by the
     * other exposed APIs members.
     *
     * @constant {module:sovereignty}
     */
    exports.sovereignty = require('./sovereignty')(internal);

    /**
     * This is an instance of `universe` module configured to use the
     * options provided to the factory. This instance uses a cache shared by the
     * other exposed APIs members.
     *
     * @constant {module:universe}
     */
    exports.universe = require('./universe')(internal);

    /**
     * This is an instance of `wars` module configured to use the
     * options provided to the factory. This instance uses a cache shared by the
     * other exposed APIs members.
     *
     * @constant {module:wars}
     */
    exports.wars = require('./wars')(internal);

    return exports;
};
