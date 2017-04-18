const CallableInstance = require('../../internal/callable-instance');

/**
 * An api adapter over the end points handling bloodlines via functions in the
 * [universe](https://esi.tech.ccp.is/latest/#/Universe) ESI endpoints. You
 * should not usually instantiate this directly as its constructor requires an
 * internal api instance.
 *
 * This is a function class so instances of `Bloodlines` are functions and can
 * be invoked directly, besides accessing its members. Its default function
 * action is equivalent to {@link Bloodlines#all all}.
 */
class Bloodlines extends CallableInstance {
  /**
   * Create a new Bloodlines function using the given `agent`.
   *
   * @param agent {ESIAgent} The ESI agent
   * @constructor
   */
  constructor(agent) {
    super(() => this.all());
    this._agent = agent;
  }

  /**
   * @esi_route get_universe_bloodlines
   * @esi_example esi.bloodlines()
   *
   * @returns {Promise.<Array.<Object>>}
   */
  all() {
    return this._agent.noAuth.get('/v1/universe/bloodlines/');
  }
}

module.exports = Bloodlines;
