const ExtendableFunction = require('../../internal/ExtendableFunction');
const [PageHandler,] = require('../../internal/PageHandler');
const Search = require('../Search');


/**
 * An api adapter that provides functions for accessing various details for a
 * structure accessible by the character, specified by id, via functions in the
 * [universe](https://esi.tech.ccp.is/latest/#/Universe) ESI endpoints. You
 * should not usually instantiate this directly as its constructor requires an
 * internal api instance.
 */
class Structure {
  /**
   * Create a new Structure for the given `api` provider and specific
   * `structureId`. Requires an access token for a character with access to the
   * structure.
   *
   * @param api {ApiProvider} The api provider used to generate web requests
   * @param structureId {Number} The structure id that is used for all requests
   * @param token {String} Access token of a character with on the ACL list of
   *     the structure
   * @constructor
   */
  constructor(api, structureId, token) {
    this._api = api;
    this._id = structureId;
    this._token = token;

    this._all = new PageHandler(page => this.orders(page));
  }

  /**
   * Get structure info from the ESI endpoint. This makes an
   * HTTP GET request to
   * [`/universe/structures/{id}/`](https://esi.tech.ccp.is/latest/#!/Universe/get_universe_structures_structure_id).
   * The request is returned as an asynchronous Promise that resolves to an
   * object parsed from the response JSON model. An example value looks like:
   *
   * ```
   * {
   *   "name": "V-3YG7 VI - The Capital",
   *   "solar_system_id": 30000142
   * }
   * ```
   *
   * @return {Promise} A Promise that resolves to the response of the request
   * @esi_link UniverseApi.getUniverseStructuresStructureId
   */
  info() {
    return this._api.universe(this._token)
    .newRequest('getUniverseStructuresStructureId', [this._id]);
  }

  /**
   * Get a page of market orders in the structure from the ESI endpoint. Orders
   * include buy and sell, and are for any item type. This makes an HTTP GET
   * request to
   * [`/markets/structures/{structureId}/`](https://esi.tech.ccp.is/latest/#!/Market/get_market_structures_structure_id).
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
   * @esi_link MarketApi.getMarketsStructuresStructureId
   */
  orders(page = 0) {
    if (page == 0) {
      return this._all.getAll();
    } else {
      return this._api.market(this._token)
      .newRequest('getMarketsStructuresStructureId', [this._id],
          { page: page });
    }
  }

  /**
   * Get all buy market orders in the region for the particular item type. This
   * is equivalent to {@link Structure#ordersFor ordersFor} except that it
   * additionally filters orders to have `is_buy_order` set to `true`.
   *
   * @param {Number} typeId The type id to query from the market
   * @return {Promise} A Promise that resolves to the response of the request
   */
  buyOrdersFor(typeId) {
    return this.ordersFor(typeId).then(typeOrders => {
      return typeOrders.filter(o => o.is_buy_order == true);
    });
  }

  /**
   * Get all sell market orders in the region for the particular item type.
   * This
   * is equivalent to {@link Structure#ordersFor ordersFor} except that it
   * additionally filters orders to have `is_buy_order` set to `false`.
   *
   * @param {Number} typeId The type id to query from the market
   * @return {Promise} A Promise that resolves to the response of the request
   */
  sellOrdersFor(typeId) {
    return this.ordersFor(typeId).then(typeOrders => {
      return typeOrders.filter(o => o.is_buy_order == false);
    });
  }

  /**
   * Get all market orders in the region for the given item type from the
   * ESI endpoint. Orders include buy and sell, but are restricted to the
   * selected type id.
   *
   * While the ESI endpoints support native type filtering for regions, this
   * type filtering is implemented in-library for structures. This means that
   * all orders for the structure are requested via {@link Structure.orders
   * orders} and then filtered.
   *
   * @param {Number} typeId The type id to query from the market
   * @return {Promise} A Promise that resolves to the response of the request
   */
  ordersFor(typeId) {
    return this.orders().then(allOrders => {
      return allOrders.filter(o => o.type_id == typeId);
    });
  }
}

/**
 * An api adapter over the end points handling structures via functions in the
 * [universe](https://esi.tech.ccp.is/latest/#/Universe) and
 * [search](https://esi.tech.ccp.is/latest/#/Search) ESI endpoints. You
 * should not usually instantiate this directly as its constructor requires an
 * internal api instance.
 *
 * This is a function class so instances of `Structures` are functions and can
 * be invoked directly, besides accessing its members. Its default function
 * action is equivalent to {@link Structures#get get}.
 */
class Structures extends ExtendableFunction {
  /**
   * Create a new Structures function using the given `api` and tied to
   * the character.
   *
   * @param api {ApiProvider} The api provider
   * @param characterId {Number} The character whose structures are accessed
   * @param token {String} SSO access token for the character
   * @constructor
   */
  constructor(api, characterId, token) {
    super(id => this.get(id));
    this._api = api;
    this._token = token;

    /**
     * A Search module instance configured to search over the `'structure'`
     * type and linked to the character.
     *
     * @type {Search}
     */
    this.search = new Search(api, ['structure'], characterId, token);
  }

  /**
   * Create a new Structure end point targeting the particular structure by
   * `id`.
   *
   * @param id {Number} The structure id
   * @returns {Structure}
   */
  get(id) {
    return new Structure(this._api, id, this._token);
  }
}

module.exports = Structures;
