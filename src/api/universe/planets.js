const Search = require('../search');

const CallableInstance = require('../../internal/callable-instance');

/**
 * An api adapter that provides functions for accessing various details for a
 * planet specified by id, via functions in the
 * [universe](https://esi.tech.ccp.is/latest/#/Universe) ESI endpoints. You
 * should not usually instantiate this directly as its constructor requires an
 * internal api instance.
 */
class Planet {
  /**
   * Create a new Planet for the given `agent` provider and specific
   * `planetId`.
   *
   * @param agent {ESIAgent} The agent used to generate web requests
   * @param planetId {Number} The planet id that is used for all
   *     requests
   * @constructor
   */
  constructor(agent, planetId) {
    this._agent = agent;
    this._id = planetId;
  }

  /**
   * @esi_route get_universe_planets_planet_id
   * @esi_example esi.planets(1).info()
   *
   * @returns {Promise.<Object>}
   */
  info() {
    return this._agent.noAuth.get('/v1/universe/planets/{planet_id}/',
        { path: { 'planet_id': this._id } });
  }
}

/**
 * An api adapter that provides functions for accessing planet information via
 * the [universe](https://esi.tech.ccp.is/latest/#/Universe) ESI end points. You
 * should not usually instantiate this directly as its constructor requires an
 * internal api instance.
 *
 * This is a function class so instances of `Planets` are functions and
 * can be invoked directly, besides accessing its members. Its default function
 * action is equivalent to {@link Planets#get get}.
 */
class Planets extends CallableInstance {
  /**
   * Create a new Planets instance using the given `agent`.
   *
   * @param agent {ESIAgent} The ESI agent
   * @constructor
   */
  constructor(agent) {
    super(id => this.get(id));
    this._agent = agent;
  }

  /**
   * Create a new Planet end point targeting the particular planet
   * by `id`.
   *
   * @param id {Number} The planet id
   * @returns {Planet}
   */
  get(id) {
    return new Planet(this._agent, id);
  }
}

module.exports = Planets;
