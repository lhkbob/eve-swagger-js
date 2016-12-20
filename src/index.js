
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
