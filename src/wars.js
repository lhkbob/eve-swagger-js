/**
 * A container for the [wars](https://esi.tech.ccp.is/latest/#/Wars) ESI
 * endpoints. You should not require this module directly, as it technically
 * returns a factory function that requires an internal API. Instead an instance
 * is automatically exposed when the {@link module:eve_swagger_interface} is
 * loaded and configured.
 *
 * @see https://esi.tech.ccp.is/latest/#/Wars
 * @param api The internal API instance configured by the root module
 * @module wars
 */
module.exports = function(api) {
  var newRequest = api.newRequest;
  var ESI = api.esi;

  var exports = {};

  /**
   * Get ids of all wars from the ESI endpoint. This makes an HTTP GET request
   * to [`/wars/`](https://esi.tech.ccp.is/latest/#!/Wars/get_wars). The request
   * is returned as an asynchronous Promise that resolves to an array parsed
   * from the response JSON model. An example value looks like:
   *
   * ```
   * [
   *   3,
   *   2,
   *   1
   * ]
   * ```
   *
   * @return {external:Promise} A Promise that resolves to the response of
   *   the request
   * @see https://esi.tech.ccp.is/latest/#!/Wars/get_wars
   * @esi_link WarsApi.getWars
   */
  exports.getAll = function() {
    return newRequest(ESI.WarsApi, 'getWars', []);
  };

  /**
   * Get information on a war from the ESI endpoint. This makes an HTTP GET
   * request to
   * [`/wars/{id}/`](https://esi.tech.ccp.is/latest/#!/Wars/get_wars_war_id).
   * The request is returned as an asynchronous Promise that resolves to an
   * array parsed from the response JSON model. An example value looks like:
   *
   * ```
   * {
   *   "aggressor": {
   *     "corporation_id": 986665792,
   *     "isk_destroyed": 0,
   *     "ships_killed": 0
   *   },
   *   "declared": "2004-05-22T05:20:00Z",
   *   "defender": {
   *     "corporation_id": 1001562011,
   *     "isk_destroyed": 0,
   *     "ships_killed": 0
   *   },
   *   "id": 1941,
   *   "mutual": false,
   *   "open_for_allies": false
   * }
   * ```
   *
   * @param {Integer} id The war id to look up
   * @return {external:Promise} A Promise that resolves to the response of
   *   the request
   * @see https://esi.tech.ccp.is/latest/#!/Wars/get_wars_war_id
   * @esi_link WarsApi.getWarsWarId
   */
  exports.get = function(id) {
    return newRequest(ESI.WarsApi, 'getWarsWarId', [id]);
  };

  /**
   * Get killmail ids from a war from the ESI endpoint. This makes an HTTP GET
   * request to
   * [`/wars/{id}/killmails/`](https://esi.tech.ccp.is/latest/#!/Wars/get_wars_war_id_killmails).
   * The request is returned as an asynchronous Promise that resolves to an
   * array parsed from the response JSON model. An example value looks like:
   *
   * ```
   * [
   *   {
   *     "killmail_hash": "8eef5e8fb6b88fe3407c489df33822b2e3b57a5e",
   *     "killmail_id": 2
   *   },
   *   {
   *     "killmail_hash": "b41ccb498ece33d64019f64c0db392aa3aa701fb",
   *     "killmail_id": 1
   *   }
   * ]
   * ```
   *
   * @param {Integer} id The war id to look up
   * @return {external:Promise} A Promise that resolves to the response of
   *   the request
   * @see https://esi.tech.ccp.is/latest/#!/Wars/get_wars_war_id_killmails
   * @see module:killmails
   * @esi_link WarsApi.getWarsWarIdKillmails
   */
  exports.getKillmails = function(id) {
    return newRequest(ESI.WarsApi, 'getWarsWarIdKillmails', [id]);
  };

  return exports;
};
