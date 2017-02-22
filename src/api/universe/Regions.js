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
   * Get historical market statistics for the region and provided item type
   * from the ESI endpoint. This makes an HTTP GET request to
   * [`/markets/{regionId}/history/`](https://esi.tech.ccp.is/latest/#!/Market/get_markets_region_id_history).
   * The request is returned as an asynchronous Promise that resolves to an
   * array parsed from the response JSON model. An example value looks like:
   *
   * ```
   * [
   *   {
   *     "average": 5.25,
   *     "date": "2015-05-01",
   *     "highest": 5.27,
   *     "lowest": 5.11,
   *     "order_count": 2267,
   *     "volume": 16276782035
   *   }
   * ]
   * ```
   *
   * @param {Number} typeId The type of item on the market the statistics
   *   refer to
   * @return {Promise} A Promise that resolves to the response of the request
   * @esi_link MarketApi.getMarketsRegionIdHistory
   */
  history(typeId) {
    return this._api.market()
    .newRequest('getMarketsRegionIdHistory', [this._id, typeId]);
  }

  /**
   * Get a page of market orders in the region from the ESI endpoint. Orders
   * include buy and sell, and are for any item type. This makes an HTTP GET
   * request to
   * [`/markets/{regionId}/orders/`](https://esi.tech.ccp.is/latest/#!/Market/get_markets_region_id_orders).
   * The request is returned as an asynchronous Promise that resolves to an
   * array parsed from the response JSON model. An example value looks like:
   *
   * ```
   * [
   *   {
   *     "duration": 90,
   *     "is_buy_order": false,
   *     "issued": "2016-09-03T05:12:25Z",
   *     "location_id": 60005599,
   *     "min_volume": 1,
   *     "order_id": 4623824223,
   *     "price": 9.9,
   *     "range": "region",
   *     "type_id": 34,
   *     "volume_remain": 1296000,
   *     "volume_total": 2000000
   *   }
   * ]
   * ```
   *
   * This orders request is paginated, with `page` starting at 1 for the first
   * page of data. If `page` is not provided, then all orders are returned
   * (making multiple calls and concatenating the results).
   *
   * @param {Number} page Optional; the page of orders that is requested.
   * @return {Promise} A Promise that resolves to the response of the request
   * @esi_link MarketApi.getMarketsRegionIdOrders
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
   * Get all buy market orders in the region for the particular item type. This
   * is equivalent to {@link Region#ordersFor ordersFor} except that the
   * returned orders are limited to the `'buy'` type.
   *
   * @param {Number} typeId The type id to query from the market
   * @return {Promise} A Promise that resolves to the response of the request
   * @esi_link MarketApi.getMarketsRegionIdOrders
   */
  buyOrdersFor(typeId) {
    return this._api.market()
    .newRequest('getMarketsRegionIdOrders', ['buy', this._id],
        { typeId: typeId });
  }

  /**
   * Get all sell market orders in the region for the particular item type. This
   * is equivalent to {@link Region#ordersFor ordersFor} except that the
   * returned orders are limited to the `'sell'` type.
   *
   * @param {Number} typeId The type id to query from the market
   * @return {Promise} A Promise that resolves to the response of the request
   * @esi_link MarketApi.getMarketsRegionIdOrders
   */
  sellOrdersFor(typeId) {
    return this._api.market()
    .newRequest('getMarketsRegionIdOrders', ['sell', this._id],
        { typeId: typeId });
  }

  /**
   * Get all market orders in the region for the given item type from the
   * ESI endpoint. Orders include buy and sell, but are restricted to the
   * selected type id. This makes an HTTP GET request to
   * [`/markets/{regionId}/orders/`](https://esi.tech.ccp.is/latest/#!/Market/get_markets_region_id_orders).
   * The request is returned as an asynchronous Promise that resolves to an
   * array parsed from the response JSON model. An example value looks like:
   *
   * ```
   * [
   *   {
   *     "duration": 90,
   *     "is_buy_order": false,
   *     "issued": "2016-09-03T05:12:25Z",
   *     "location_id": 60005599,
   *     "min_volume": 1,
   *     "order_id": 4623824223,
   *     "price": 9.9,
   *     "range": "region",
   *     "type_id": 34,
   *     "volume_remain": 1296000,
   *     "volume_total": 2000000
   *   }
   * ]
   * ```
   *
   * This orders request is not paginated because it is restricted to a type.
   *
   * @param {Number} typeId The type id to query from the market
   * @return {Promise} A Promise that resolves to the response of the request
   * @esi_link MarketApi.getMarketsRegionIdOrders
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
 * [search](https://esi.tech.ccp.is/latest/#/Search) ESI endpoints. You
 * should not usually instantiate this directly as its constructor requires an
 * internal api instance.
 *
 * This is a function class so instances of `Regions` are functions and can be
 * invoked directly, besides accessing its members. Its default function action
 * is equivalent to {@link Regions#get get}.
 */
class Regions extends ExtendableFunction {
  /**
   * Create a new Regions function using the given `api`.
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
   * A Search module instance configured to search over the `'region'`
   * type.
   *
   * @returns {Search}
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
   * Get the names for a list of region ids from the ESI endpoint. This
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
   * only include matches with the region category.
   *
   * @param {Array.<Number>} ids The region ids to look up.
   * @return {Promise} A Promise that resolves to the response of the request
   * @esi_link UniverseApi.postUniverseNames
   */
  names(ids) {
    return _names(this._api, 'region', ids);
  }
}

module.exports = Regions;
