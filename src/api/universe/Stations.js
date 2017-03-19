const ExtendableFunction = require('../../internal/ExtendableFunction');
const Search = require('../Search');

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
   * @param api {ApiProvider} The api provider used to generate web requests
   * @param stationId {Number} The station id that is used for all requests
   * @constructor
   */
  constructor(api, stationId) {
    this._api = api;
    this._id = stationId;
  }

  /**
   * @esi_route get_universe_stations_station_id
   *
   * @return {Promise.<Object>}
   */
  info() {
    return this._api.universe()
    .newRequest('getUniverseStationsStationId', [this._id]);
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
class Stations extends ExtendableFunction {
  /**
   * Create a new Stations instance using the given `api`.
   *
   * @param api {ApiProvider} The api provider
   * @constructor
   */
  constructor(api) {
    super(id => this.get(id));
    this._api = api;

    this._search = null;
  }

  /**
   * A Search module instance configured to search over the `'station'`
   * type.
   *
   * @returns {Search}
   */
  get search() {
    if (!this._search) {
      this._search = new Search(this._api, ['station']);
    }
    return this._search;
  }

  /**
   * Create a new Stationend point targeting the particular system by `id`.
   *
   * @param id {Number} The station id
   * @returns {Station}
   */
  get(id) {
    return new Station(this._api, id);
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
   *
   * @param {Array.<Number>} ids
   * @return {Promise.<Array.<Object>>}
   */
  names(ids) {
    return _names(this._api, 'station', ids);
  }
}

module.exports = Stations;
