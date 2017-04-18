const CallableInstance = require('../internal/callable-instance');

/**
 * An api adapter over the end points handling killmail details via functions in
 * the [killmails](https://esi.tech.ccp.is/latest/#/Killmails) ESI endpoints.
 * You should not usually instantiate this directly as its constructor requires
 * an internal api instance.
 *
 * This is a function class so instances of `Killmail` are functions and can be
 * invoked directly, besides accessing its members. Its default function action
 * is equivalent to {@link Killmail#get get}.
 */
class Killmail extends CallableInstance {
  /**
   * Create a new Killmail function using the given `agent`.
   *
   * @param agent {ESIAgent} The ESI agent
   * @constructor
   */
  constructor(agent) {
    super((id, hash) => this.get(id, hash));
    this._agent = agent;
  }

  /**
   * @esi_route get_killmails_killmail_id_killmail_hash
   * @esi_param killmail_id - id
   * @esi_param killmail_hash - hash
   * @esi_example esi.killmail(id, hash)
   *
   * @param {Number} id
   * @param {String} hash
   * @return {Promise.<Object>}
   *
   * @see War#killmails
   * @see Character#killmails
   */
  get(id, hash) {
    return this._agent.noAuth.get(
        '/v1/killmails/{killmail_id}/{killmail_hash}/', {
          path: {
            'killmail_id': id,
            'killmail_hash': hash
          }
        });
  }
}

module.exports = Killmail;
