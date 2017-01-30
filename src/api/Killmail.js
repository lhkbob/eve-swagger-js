const ExtendableFunction = require('../internal/ExtendableFunction');

/**
 * An api adaptor over the end points handling killmail details via functions in
 * the [killmails](https://esi.tech.ccp.is/latest/#/Killmails) ESI endpoints.
 * You should not usually instantiate this directly as its constructor requires
 * an internal api instance.
 *
 * This is a function class so instances of `Killmail` are functions and can be
 * invoked directly, besides accessing its members. Its default function action
 * is equivalent to {@link Killmail#get get}.
 */
class Killmail extends ExtendableFunction {
  /**
   * Create a new Killmail function using the given `api`.
   *
   * @param api {ApiProvider} The api provider
   * @constructor
   */
  constructor(api) {
    super((id, hash) => this.get(id, hash));
    this._api = api;
  }

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
   *       "x": 452186600569.4748,
   *       "y": 146704961490.90222,
   *       "z": 109514596532.54477
   *     },
   *     "ship_type_id": 17812
   *   }
   * }
   * ```
   *
   * @param {Number} id The killmail id
   * @param {String} hash The killmail hash
   * @return {Promise} A Promise that resolves to the response of
   *   the request
   * @see War.killmails()
   * @see https://esi.tech.ccp.is/latest/#!/Killmails/get_killmails_killmail_id_killmail_hash
   * @esi_link KillmailsApi.getKillmailsKillmailIdKillmailHash
   */
  get(id, hash) {
    return this._api.killmails().newRequest('getKillmailsKillmailIdKillmailHash', [id, hash]);
  }
}

module.exports = Killmail;
