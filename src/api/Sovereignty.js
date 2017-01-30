/**
 * An api adaptor that provides functions for accessing the
 * [sovereignty](https://esi.tech.ccp.is/latest/#/Sovereignty) ESI end points.
 * You should not usually instantiate this directly as its constructor requires
 * an internal api instance.
 */
class Sovereignty {
  /**
   * Create a new Sovereignty instance using the given `api`.
   *
   * @param api {ApiProvider} The api provider
   * @constructor
   */
  constructor(api) {
    this._api = api;
  }

  /**
   * Get sovereignty campaign information from the ESI endpoint. This makes an
   * HTTP GET request to
   * [`/sovereignty/campaigns`](https://esi.tech.ccp.is/latest/#!/Sovereignty/get_sovereignty_campaigns).
   * The request is returned as an asynchronous Promise that resolves to an
   * array parsed from the response JSON model. An example value looks like:
   *
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
   *
   * @return {Promise} A Promise that resolves to the response of
   *   the request
   * @see https://esi.tech.ccp.is/latest/#!/Sovereignty/get_sovereignty_campaigns
   * @esi_link SovereigntyApi.getSovereigntyCampaigns
   */
  campaigns() {
    return this._api.sovereignty().newRequest('getSovereigntyCampaigns', []);
  }

  /**
   * Get sovereignty structure information from the ESI endpoint. This makes an
   * HTTP GET request to
   * [`/sovereignty/structures`](https://esi.tech.ccp.is/latest/#!/Sovereignty/get_sovereignty_structures).
   * The request is returned as an asynchronous Promise that resolves to an
   * array parsed from the response JSON model. An example value looks like:
   *
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
   *
   * @return {Promise} A Promise that resolves to the response of
   *   the request
   * @see https://esi.tech.ccp.is/latest/#!/Sovereignty/get_sovereignty_structures
   * @esi_link SovereigntyApi.getSovereigntyStructures
   */
  structures() {
    return this._api.sovereignty().newRequest('getSovereigntyStructures', []);
  }
}



module.exports = Sovereignty;
