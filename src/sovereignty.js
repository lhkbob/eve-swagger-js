/**
 * A container for the [sovereignty](https://esi.tech.ccp.is/latest/#/Sovereignty)
 * ESI endpoints. You should not require this module directly, as it technically
 * returns a factory function that requires an internal API. Instead an instance
 * is automatically exposed when the 
 * {@link module:eve_swagger_interface} is loaded and configured.
 *
 * @see https://esi.tech.ccp.is/latest/#/Sovereignty
 * @param api The internal API instance configured by the root module
 * @module sovereignty
 */
 module.exports = function(api) {
    var newRequest = api.newRequest;
    var ESI = api.esi;

    var exports = {};

    /**
     * Get sovereignty campaign information from the ESI endpoint. This makes an 
     * HTTP GET request to [`/sovereignty/campaigns`](https://esi.tech.ccp.is/latest/#!/Sovereignty/get_sovereignty_campaigns).
     * The request is returned as an asynchronous Promise that resolves to 
     * an array parsed from the response JSON model. An example value looks 
     * like:
     * ```
     * [
     *   {
     *     "attackers_score": 0.4,
     *     "campaign_id": 32833,
     *     "constellation_id": 20000125,
     *     "defender_id": 1695357456,
     *     "defender_score": 0.6,
     *     "event_type": "station_defense",
     *     "solar_system_id": 30000856,
     *     "start_time": "2016-10-29T14:34:40Z",
     *     "structure_id": 61001096
     *   }
     * ]
     * ```
     * @return {external:Promise} A Promise that resolves to the response of
     *   the request
     * @see https://esi.tech.ccp.is/latest/#!/Sovereignty/get_sovereignty_campaigns
     * @esi_link SovereigntyApi.getSovereigntyCampaigns
     */
    exports.getCampaigns = function() {
        return newRequest(ESI.SovereigntyApi, 'getSovereigntyCampaigns', []);
    };

    /**
     * Get sovereignty structure information from the ESI endpoint. This makes an 
     * HTTP GET request to [`/sovereignty/structures`](https://esi.tech.ccp.is/latest/#!/Sovereignty/get_sovereignty_structures).
     * The request is returned as an asynchronous Promise that resolves to 
     * an array parsed from the response JSON model. An example value looks 
     * like:
     * ```
     * [
     *   {
     *     "alliance_id": 498125261,
     *     "solar_system_id": 30000570,
     *     "structure_id": 1018253388776,
     *     "structure_type_id": 32226,
     *     "vulnerability_occupancy_level": 2,
     *     "vulnerable_end_time": "2016-10-29T05:30:00Z",
     *     "vulnerable_start_time": "2016-10-28T20:30:00Z"
     *   }
     * ]
     * ```
     * @return {external:Promise} A Promise that resolves to the response of
     *   the request
     * @see https://esi.tech.ccp.is/latest/#!/Sovereignty/get_sovereignty_structures
     * @esi_link SovereigntyApi.getSovereigntyStructures
     */
    exports.getCampaigns = function() {
        return newRequest(ESI.SovereigntyApi, 'getSovereigntyStructures', []);
    };

    return exports;
};
