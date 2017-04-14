const Search = require('../Search');

const ExtendableFunction = require('../../internal/ExtendableFunction');

/**
 * An api adapter that provides functions for accessing various details for a
 * moon specified by id, via functions in the
 * [universe](https://esi.tech.ccp.is/latest/#/Universe) ESI endpoints. You
 * should not usually instantiate this directly as its constructor requires an
 * internal api instance.
 */
class Moon {
  /**
   * Create a new Moon for the given `agent` provider and specific
   * `moonId`.
   *
   * @param agent {ESIAgent} The ESI agent used to generate web requests
   * @param moonId {Number} The moon id that is used for all
   *     requests
   * @constructor
   */
  constructor(agent, moonId) {
    this._agent = agent;
    this._id = moonId;
  }

  /**
   * @esi_route get_universe_moons_moon_id
   *
   * @returns {Promise.<Object>}
   */
  info() {
    return this._agent.noAuth.get('/v1/universe/moons/{moon_id}/',
        { path: { 'moon_id': this._id } });
  }
}

/**
 * An api adapter that provides functions for accessing moon information via the
 * [universe](https://esi.tech.ccp.is/latest/#/Universe) ESI end points. You
 * should not usually instantiate this directly as its constructor requires an
 * internal api instance.
 *
 * This is a function class so instances of `Moons` are functions and
 * can be invoked directly, besides accessing its members. Its default function
 * action is equivalent to {@link Moons#get get}.
 */
class Moons extends ExtendableFunction {
  /**
   * Create a new Moons instance using the given `agent`.
   *
   * @param agent {ESIAgent} The ESI agent
   * @constructor
   */
  constructor(agent) {
    super(id => this.get(id));
    this._agent = agent;
  }

  /**
   * Create a new Moon end point targeting the particular moon
   * by `id`.
   *
   * @param id {Number} The moon id
   * @returns {Moon}
   */
  get(id) {
    return new Moon(this._agent, id);
  }
}

module.exports = Moons;
