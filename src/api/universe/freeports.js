const CallableInstance = require('../../internal/callable-instance');

/**
 * An api adapter over the end points handling public structures via functions
 * in the [universe](https://esi.tech.ccp.is/latest/#/Universe) ESI endpoints.
 * You should not usually instantiate this directly as its constructor requires
 * an internal api instance.
 *
 * This is a function class so instances of `Freeports` are functions and can be
 * invoked directly, besides accessing its members. Its default function action
 * is equivalent to {@link Freeports#all all}.
 */
class Freeports extends CallableInstance {
  /**
   * Create a new Freeports function using the given `agent`.
   *
   * @param agent {ESIAgent} The ESI agent
   * @constructor
   */
  constructor(agent) {
    super(() => this.all());
    this._agent = agent;
  }

  /**
   * @esi_route get_universe_structures
   * @esi_example esi.freeports()
   *
   * @returns {Promise.<Array.<Number>>}
   */
  all() {
    return this._agent.noAuth.get('/v1/universe/structures/');
  }
}

module.exports = Freeports;
