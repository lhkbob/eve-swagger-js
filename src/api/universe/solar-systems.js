const CallableInstance = require('../../internal/callable-instance');
const Search = require('../search');

const _names = require('../../internal/names');

/**
 * An api adapter for dealing with a single solar system, currently only
 * supporting fetching simple information and calculating routes between
 * systems.
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

  _getRoute(type, to, avoid, connections) {
    // Build up single level connections array
    let flatConnections = [];
    for (let c of connections) {
      flatConnections.push(c[0] + '|' + c[1]);
    }
    return this._agent.noAuth.get('/v1/route/{origin}/{destination}/', {
      path: {
        'origin': this._id,
        'destination': to
      },
      query: {
        'flag': type,
        'avoid': avoid,
        'connections': flatConnections
      }
    });
  }

  /**
   * @esi_route get_route_origin_destination
   * @esi_param destination - to
   * @esi_param flag - "shortest"
   *
   * @esi_example esi.solarSystems(1).shortestRoute(2, {...})
   *
   * @param to {Number}
   * @param avoid {Array.<Number>} Defaults to `[]`
   * @param connections {Array.<Array.<Number>>} Defaults to `[]`
   * @returns {Promise.<Array.<Number>>}
   */
  shortestRoute(to, { avoid: avoid = [], connections: connections = [] } = {}) {
    return this._getRoute('shortest', to, avoid, connections);
  }

  /**
   * @esi_route get_route_origin_destination
   * @esi_param destination - to
   * @esi_param flag - "secure"
   *
   * @esi_example esi.solarSystems(1).secureRoute(2, {...})
   *
   * @param to {Number}
   * @param avoid {Array.<Number>} Defaults to `[]`
   * @param connections {Array.<Array.<Number>>} Defaults to `[]`
   * @returns {Promise.<Array.<Number>>}
   */
  secureRoute(to, { avoid: avoid = [], connections: connections = [] } = {}) {
    return this._getRoute('secure', to, avoid, connections);
  }

  /**
   * @esi_route get_route_origin_destination
   * @esi_param destination - to
   * @esi_param flag - "insecure"
   *
   * @esi_example esi.solarSystems(1).insecureRoute(2, {...})
   *
   * @param to {Number}
   * @param avoid {Array.<Number>} Defaults to `[]`
   * @param connections {Array.<Array.<Number>>} Defaults to `[]`
   * @returns {Promise.<Array.<Number>>}
   */
  insecureRoute(to, { avoid: avoid = [], connections: connections = [] } = {}) {
    return this._getRoute('insecure', to, avoid, connections);
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
   * @esi_route get_universe_system_jumps
   * @esi_example esi.solarSystems.jumpStats()
   *
   * @returns {Promise.<Array.<Object>>}
   */
  jumpStats() {
    return this._agent.noAuth.get('/v1/universe/system_jumps/');
  }

  /**
   * @esi_route get_universe_system_kills
   * @esi_example esi.solarSystems.killStats()
   *
   * @returns {Promise.<Array.<Object>>}
   */
  killStats() {
    return this._agent.noAuth.get('/v1/universe/system_kills/');
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
