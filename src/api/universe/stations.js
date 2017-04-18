const CallableInstance = require('../../internal/callable-instance');
const Search = require('../search');

const _names = require('../../internal/names');

/**
 * An api adapter for dealing with a single station, currently only supporting
 * fetching simple information.
 */
class Station {
  /**
   * Create a new Station for the given `api` provider and specific
   * `stationId`.
   *
   * @param agent {ESIAgent} The agent used to generate web requests
   * @param stationId {Number} The station id that is used for all requests
   * @constructor
   */
  constructor(agent, stationId) {
    this._agent = agent;
    this._id = stationId;
  }

  /**
   * @esi_route get_universe_stations_station_id
   * @esi_example esi.stations(1).info()
   *
   * @return {Promise.<Object>}
   */
  info() {
    return this._agent.noAuth.get('/v2/universe/stations/{station_id}/',
        {path: {'station_id': this._id}});
  }
}

/**
 * An api adapter that provides functions for accessing station information via
 * the [universe](https://esi.tech.ccp.is/latest/#/Universe) and
 * [search](https://esi.tech.ccp.is/latest/#/Search) ESI end points. You should
 * not usually instantiate this directly as its constructor requires an internal
 * api instance.
 *
 * This is a function class so instances of `Stations` are functions and can be
 * invoked directly, besides accessing its members. Its default function action
 * is equivalent to {@link Stations#get get}.
 */
class Stations extends CallableInstance {
  /**
   * Create a new Stations instance using the given `agent`.
   *
   * @param agent {ESIAgent} The ESI Agent
   * @constructor
   */
  constructor(agent) {
    super(id => this.get(id));
    this._agent = agent;

    this._search = null;
  }

  /**
   * A Search module instance configured to search over the `'station'`
   * type.
   *
   * @esi_example esi.stations.search('text') category=[station] get_search
   *
   * @type {Search}
   */
  get search() {
    if (!this._search) {
      this._search = new Search(this._agent, ['station']);
    }
    return this._search;
  }

  /**
   * Create a new Station end point targeting the particular system by `id`.
   *
   * @param id {Number} The station id
   * @returns {Station}
   */
  get(id) {
    return new Station(this._agent, id);
  }

  /**
   * @esi_route post_universe_names
   *
   * Results will only include matches with the station category.
   * If `ids` is longer than the reported maximum length for ESI, the array
   * will be split into smaller chunks and multiple requests will be made and
   * then concatenated back together.
   *
   * @esi_returns {!category}
   * @esi_example esi.stations.names(ids) category=[station]
   *
   * @param {Array.<Number>} ids
   * @return {Promise.<Array.<Object>>}
   */
  names(ids) {
    return _names(this._agent, 'station', ids);
  }
}

module.exports = Stations;
