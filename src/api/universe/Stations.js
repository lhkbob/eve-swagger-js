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
   * Get station public info from the ESI endpoint. This makes an HTTP GET
   * request to
   * [`/universe/stations/{id}/`](https://esi.tech.ccp.is/latest/#!/Universe/get_universe_stations_station_id).
   * The request is returned as an asynchronous Promise that resolves to an
   * object parsed from the response JSON model. An example value looks like:
   *
   * ```
   * {
   *   "solar_system_id": 30000142,
   *   "station_name": "Jita IV Moon IV - Caldari Navy Assembly Plant"
   * }
   * ```
   *
   * @return {Promise} A Promise that resolves to the response of the request
   * @esi_link UniverseApi.getUniverseStationsStationId
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
   * Get the names for a list of station ids from the ESI endpoint. This
   * makes an HTTP POST request to
   * [`universe/names/`](https://esi.tech.ccp.is/latest/#!/Universe/post_universe_names).
   * The request is returned as an asynchronous Promise that resolves to an
   * array parsed from the response JSON model. An example value looks like:
   *
   * ```
   * [
   *   {
   *     "id": 1000171,
   *     "name": "Republic University"
   *   }
   * ]
   * ```
   *
   * Note that this has the category field stripped from the response and will
   * only include matches with the station category.
   *
   * @param {Array.<Number>} ids The station ids to look up.
   * @return {Promise} A Promise that resolves to the response of the request
   * @esi_link UniverseApi.postUniverseNames
   */
  names(ids) {
    return _names(this._api, 'station', ids);
  }
}

module.exports = Stations;
