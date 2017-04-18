const CallableInstance = require('../../internal/callable-instance');
const Search = require('../search');

const _names = require('../../internal/names');

/**
 * An api adapter for dealing with a single solar system, currently only
 * supporting fetching simple information.
 */
class SolarSystem {
  /**
   * Create a new SolarSystem for the given `agent` provider and specific
   * `solarSystemId`.
   *
   * @param agent {ESIAgent} The agent used to generate web requests
   * @param solarSystemId {Number} The system id that is used for all requests
   * @constructor
   */
  constructor(agent, solarSystemId) {
    this._agent = agent;
    this._id = solarSystemId;
  }

  /**
   * @esi_route get_universe_systems_system_id
   * @esi_example esi.solarSystems(1).info()
   *
   * @return {Promise.<Object>}
   */
  info() {
    return this._agent.noAuth.get('/v2/universe/systems/{system_id}/',
        { path: { 'system_id': this._id } });
  }
}

/**
 * An api adapter that provides functions for accessing solar system information
 * via the [universe](https://esi.tech.ccp.is/latest/#/Universe) and
 * [search](https://esi.tech.ccp.is/latest/#/Search) ESI end points. You should
 * not usually instantiate this directly as its constructor requires an internal
 * api instance.
 *
 * This is a function class so instances of `SolarSystems` are functions and can
 * be invoked directly, besides accessing its members. Its default function
 * action is equivalent to {@link SolarSystems#get get} or {@link
    * SolarSystems#all all} if no id is provided.
 */
class SolarSystems extends CallableInstance {
  /**
   * Create a new SolarSystems instance using the given `api`.
   *
   * @param agent {ESIAgent} The ESI agent
   * @constructor
   */
  constructor(agent) {
    super(id => (id ? this.get(id) : this.all()));
    this._agent = agent;

    this._search = null;
  }

  /**
   * A Search module instance configured to search over the `'solarsystem'`
   * type.
   *
   * @esi_example esi.solarSystems.search('text') category=[solarsystem] get_search
   *
   * @type {Search}
   */
  get search() {
    if (!this._search) {
      this._search = new Search(this._agent, ['solarsystem']);
    }
    return this._search;
  }

  /**
   * Create a new SolarSystem end point targeting the particular system by `id`.
   *
   * @param id {Number} The solar system id
   * @returns {SolarSystem}
   */
  get(id) {
    return new SolarSystem(this._agent, id);
  }

  /**
   * @esi_route get_universe_systems
   * @esi_example esi.solarSystems()
   *
   * @returns {Promise.<Array.<Number>>}
   */
  all() {
    return this._agent.noAuth.get('/v1/universe/systems/');
  }

  /**
   * @esi_route post_universe_names
   *
   * Results will only include matches with the solar system category.
   * If `ids` is longer than the reported maximum length for ESI, the array
   * will be split into smaller chunks and multiple requests will be made and
   * then concatenated back together.
   *
   * @esi_returns {!category}
   * @esi_example esi.solarSystems.names() category=[solar_system]
   *
   * @param {Array.<Number>} ids If no ids are provided, then all names are
   *     returned.
   * @return {Promise.<Array.<Object>>}
   */
  names(ids = []) {
    if (!ids || ids.length == 0) {
      return this.all().then(allIds => this.names(allIds));
    } else {
      return _names(this._agent, 'solar_system', ids);
    }
  }
}

module.exports = SolarSystems;
