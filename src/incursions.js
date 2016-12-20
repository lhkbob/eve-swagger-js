/**
 * A container for the [incursions](https://esi.tech.ccp.is/latest/#/Incursions)
 * ESI endpoints. You should not require this module directly, as it technically
 * returns a factory function that requires an internal API. Instead an instance
 * is automatically exposed when the 
 * {@link module:eve_swagger_interface} is loaded and configured.
 *
 * @see https://esi.tech.ccp.is/latest/#/Incursions
 * @param api The internal API instance configured by the root module
 * @module incursions
 */
 module.exports = function(api) {
    var newRequest = api.newRequest;
    var ESI = api.esi;

    var exports = {};

    /**
     * Get all incursions from the ESI endpoint. This makes an HTTP GET
     * request to [`/incursions`](https://esi.tech.ccp.is/latest/#!/Incursions/get_incursions).
     * The request is returned as an asynchronous Promise that resolves to 
     * an array parsed from the response JSON model. An example value looks 
     * like:
     * ```
     * [
     *   {
     *     "constellation_id": 20000607,
     *     "faction_id": 500019,
     *     "has_boss": true,
     *     "infested_solar_systems": [
     *        30004148,
     *        30004149,
     *        30004150,
     *        30004151,
     *        30004152,
     *        30004153,
     *        30004154
     *     ],
     *     "influence": 1,
     *     "staging_solar_system_id": 30004154,
     *     "state": "mobilizing",
     *     "type": "Incursion"
     *   }
     * ]
     * ```
     * @return {external:Promise} A Promise that resolves to the response of
     *   the request
     * @see https://esi.tech.ccp.is/latest/#!/Incursions/get_incursions
     * @esi_link IncursionsApi.getIncursions
     */
    exports.getAll = function() {
        return newRequest(ESI.IncursionsApi, 'getIncursions', []);
    };

    return exports;
};
