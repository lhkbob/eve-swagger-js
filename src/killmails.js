/**
 * A container for the [killmails](https://esi.tech.ccp.is/latest/#/Killmails)
 * ESI endpoints. You should not require this module directly, as it technically
 * returns a factory function that requires an internal API. Instead an instance
 * is automatically exposed when the {@link module:eve_swagger_interface} is
 * loaded and configured.
 *
 * @see https://esi.tech.ccp.is/latest/#/Killmails
 * @param api The internal API instance configured by the root module
 * @module killmails
 */
module.exports = function(api) {
  var newRequest = api.newRequest;
  var ESI = api.esi;

  var exports = {};

  /**
   * Get the details from a killmail with the ESI endpoint. This makes an HTTP
   * GET request to
   * [`/killmails/{id}/{hash}/`](https://esi.tech.ccp.is/latest/#!/Killmails/get_killmails_killmail_id_killmail_hash).
   * The request is returned as an asynchronous Promise that resolves to an
   * object parsed from the response JSON model. An example value looks like:
   *
   * ```
   * {
   *   "attackers": [
   *     {
   *       "character_id": 95810944,
   *       "corporation_id": 1000179,
   *       "damage_done": 5745,
   *       "faction_id": 500003,
   *       "final_blow": true,
   *       "security_status": -0.3,
   *       "ship_type_id": 17841,
   *       "weapon_type_id": 3074
   *     }
   *   ],
   *   "killmail_id": 56733821,
   *   "killmail_time": "2016-10-22T17:13:36Z",
   *   "solar_system_id": 30002976,
   *   "victim": {
   *     "alliance_id": 621338554,
   *     "character_id": 92796241,
   *     "corporation_id": 841363671,
   *     "damage_taken": 5745,
   *     "items": [
   *       {
   *         "flag": 20,
   *         "item_type_id": 5973,
   *         "quantity_dropped": 1,
   *        "singleton": 0
   *       }
   *     ],
   *     "position": {
   *     "x": 452186600569.4748,
   *     "y": 146704961490.90222,
   *     "z": 109514596532.54477
   *   },
   *   "ship_type_id": 17812
   * }
   * ```
   *
   * @param {Integer} id The killmail id
   * @param {String} hash The killmail hash
   * @return {external:Promise} A Promise that resolves to the response of
   *   the request
   * @see module:wars.getKillmails
   * @see https://esi.tech.ccp.is/latest/#!/Killmails/get_killmails_killmail_id_killmail_hash
   * @esi_link KillmailsApi.getKillmailsKillmailIdKillmailHash
   */
  exports.get = function(id, hash) {
    return newRequest(ESI.KillmailsApi, 'getKillmailsKillmailIdKillmailHash',
        [id, hash]);
  };

  return exports;
};
