const ExtendableFunction = require('../../internal/ExtendableFunction');
const [PageHandler,] = require('../../internal/PageHandler');
const Search = require('../Search');

const _names = require('../../internal/names');

/**
 * An api adapter that provides functions for accessing various details for a
 * region specified by id, via functions in the
 * [market](https://esi.tech.ccp.is/latest/#/Market) ESI endpoints. You should
 * not usually instantiate this directly as its constructor requires an internal
 * api instance.
 */
class Region {
  /**
   * Create a new Region for the given `api` provider and specific
   * `regionId`.
   *
   * @param api {ApiProvider} The api provider used to generate web requests
   * @param regionId {Number} The region id that is used for all requests
   * @constructor
   */
  constructor(api, regionId) {
    this._api = api;
    this._id = regionId;
    this._all = new PageHandler(page => this.orders(page))
  }

  /**
   * @esi_route get_universe_regions_region_id
   *
   * @returns {Promise.<Object>}
   */
  info() {
    return this._api.universe()
    .newRequest('getUniverseRegionsRegionId', [this._id]);
  }

  /**
   * @esi_route get_markets_region_id_history
   *
   * @param {Number} typeId
   * @return {Promise.<Array.<Object>>}
   */
  history(typeId) {
    return this._api.market()
    .newRequest('getMarketsRegionIdHistory', [this._id, typeId]);
  }

  /**
   * @esi_route get_markets_region_id_orders
   * @esi_param order_type - "all"
   * @esi_param !type_id
   *
   * @param {Number} page
   * @return {Promise.<Array.<Object>>}
   */
  orders(page = 0) {
    if (page == 0) {
      return this._all.getAll();
    } else {
      return this._api.market()
      .newRequest('getMarketsRegionIdOrders', ['all', this._id],
          { page: page });
    }
  }

  /**
   * @esi_route get_markets_region_id_orders
   * @esi_param order_type - "buy"
   * @esi_param !page
   *
   * @param {Number} typeId
   * @return {Promise.<Array.<Object>>}
   */
  buyOrdersFor(typeId) {
    return this._api.market()
    .newRequest('getMarketsRegionIdOrders', ['buy', this._id],
        { typeId: typeId });
  }

  /**
   * @esi_route get_markets_region_id_orders
   * @esi_param order_type - "sell"
   * @esi_param !page
   *
   * @param {Number} typeId
   * @return {Promise.<Array.<Object>>}
   */
  sellOrdersFor(typeId) {
    return this._api.market()
    .newRequest('getMarketsRegionIdOrders', ['sell', this._id],
        { typeId: typeId });
  }

  /**
   * @esi_route get_markets_region_id_orders
   * @esi_param order_type - "all"
   * @esi_param !page
   *
   * @param {Number} typeId
   * @return {Promise.<Array.<Object>>}
   */
  ordersFor(typeId) {
    return this._api.market()
    .newRequest('getMarketsRegionIdOrders', ['all', this._id],
        { typeId: typeId });
  }
}

/**
 * An api adapter over the end points handling regions via functions in the
 * [universe](https://esi.tech.ccp.is/latest/#/Universe) and
 * [search](https://esi.tech.ccp.is/latest/#/Search) ESI endpoints. You should
 * not usually instantiate this directly as its constructor requires an internal
 * api instance.
 *
 * This is a function class so instances of `Regions` are functions and can be
 * invoked directly, besides accessing its members. Its default function action
 * is equivalent to {@link Regions#get get} or to {@link Regions#all all} if no
 * id is provided.
 */
class Regions extends ExtendableFunction {
  /**
   * Create a new Regions function using the given `api`.
   *
   * @param api {ApiProvider} The api provider
   * @constructor
   */
  constructor(api) {
    super(id => (id ? this.get(id) : this.all()));
    this._api = api;

    this._search = null;
  }

  /**
   * A Search module instance configured to search over the `'region'` type.
   *
   * @type {Search}
   */
  get search() {
    if (!this._search) {
      this._search = new Search(this._api, ['region']);
    }
    return this._search;
  }

  /**
   * Create a new Region end point targeting the particular region by `id`.
   *
   * @param id {Number} The region id
   * @returns {Region}
   */
  get(id) {
    return new Region(this._api, id);
  }

  /**
   * @esi_route get_universe_regions
   *
   * @returns {Promise.<Array.<Number>>}
   */
  all() {
    return this._api.universe().newRequest('getUniverseRegions', []);
  }

  /**
   * @esi_route post_universe_names
   *
   * Results will only include matches with the region category.
   * If `ids` is longer than the reported maximum length for ESI, the array
   * will be split into smaller chunks and multiple requests will be made and
   * then concatenated back together.
   *
   * @esi_returns {!category}
   *
   * @param {Array.<Number>} ids If no ids are provided, then all names are
   *     returned.
   * @return {Promise.<Array.<Object>>}
   */
  names(ids = []) {
    if (!ids || ids.length == 0) {
      return this.all().then(allIds => this.names(allIds));
    } else {
      return _names(this._api, 'region', ids);
    }
  }
}

module.exports = Regions;
