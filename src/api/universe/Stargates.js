const Search = require('../Search');

const ExtendableFunction = require('../../internal/ExtendableFunction');

/**
 * An api adapter that provides functions for accessing various details for a
 * stargate specified by id, via functions in the
 * [universe](https://esi.tech.ccp.is/latest/#/Universe) ESI endpoints. You
 * should not usually instantiate this directly as its constructor requires an
 * internal api instance.
 */
class Stargate {
  /**
   * Create a new Stargate for the given `agent` provider and specific
   * `stargateId`.
   *
   * @param agent {ESIAgent} The agent used to generate web requests
   * @param stargateId {Number} The stargate id that is used for all requests
   * @constructor
   */
  constructor(agent, stargateId) {
    this._agent = agent;
    this._id = stargateId;
  }

  /**
   * @esi_route get_universe_stargates_stargate_id
   *
   * @returns {Promise.<Object>}
   */
  info() {
    return this._agent.noAuth.get('/v1/universe/stargates/{stargate_id}/',
        { path: { 'stargate_id': this._id } });
  }
}

/**
 * An api adapter that provides functions for accessing stargate information via
 * the [universe](https://esi.tech.ccp.is/latest/#/Universe) ESI end points. You
 * should not usually instantiate this directly as its constructor requires an
 * internal api instance.
 *
 * This is a function class so instances of `Stargates` are functions and
 * can be invoked directly, besides accessing its members. Its default function
 * action is equivalent to {@link Stargates#get get}.
 */
class Stargates extends ExtendableFunction {
  /**
   * Create a new Stargates instance using the given `api`.
   *
   * @param agent {ESIAgent} The ESI agent
   * @constructor
   */
  constructor(agent) {
    super(id => this.get(id));
    this._agent = agent;
  }

  /**
   * Create a new Stargate end point targeting the particular stargate
   * by `id`.
   *
   * @param id {Number} The stargate id
   * @returns {Stargate}
   */
  get(id) {
    return new Stargate(this._agent, id);
  }
}

module.exports = Stargates;
