const CallableInstance = require('../../internal/callable-instance');
const [PageHandler,] = require('../../internal/page-handler');
const Search = require('../search');


/**
 * An api adapter that provides functions for accessing various details for a
 * structure accessible by the character, specified by id, via functions in the
 * [universe](https://esi.tech.ccp.is/latest/#/Universe) ESI endpoints. You
 * should not usually instantiate this directly as its constructor requires an
 * internal api instance.
 */
class Structure {
  /**
   * Create a new Structure for the given `agent` provider and specific
   * `structureId`. Requires an access token for a character with access to the
   * structure.
   *
   * @param agent {ESIAgent} The agent used to generate web requests
   * @param structureId {Number} The structure id that is used for all requests
   * @param token {String} Access token of a character with on the ACL list of
   *     the structure
   * @constructor
   */
  constructor(agent, structureId, token) {
    this._agent = agent;
    this._id = structureId;
    this._token = token;

    this._all = new PageHandler(page => this.orders(page));
  }

  /**
   * @esi_route get_universe_structures_structure_id
   * @esi_example esi.characters(1, 'token').structures(2).info()
   *
   * @returns {Promise.<Object>}
   */
  info() {
    return this._agent.auth(this._token)
    .get('/v1/universe/structures/{structure_id}/',
        { path: { 'structure_id': this._id } });
  }

  /**
   * @esi_route get_markets_structures_structure_id
   * @esi_example esi.characters(1, 'token').structures(2).orders() orders=all
   *
   * @param page {Number} If `0`, all pages of orders are returned as a
   *     concatenated array.
   * @returns {Promise.<Array.<Object>>}
   */
  orders(page = 0) {
    if (page == 0) {
      return this._all.getAll();
    } else {
      return this._agent.auth(this._token)
      .get('/v1/markets/structures/{structure_id}/', {
        path: { 'structure_id': this._id },
        query: { 'page': page }
      });
    }
  }

  /**
   * Get all buy market orders in the region for the particular item type. This
   * is equivalent to {@link Structure#ordersFor ordersFor} except that it
   * additionally filters orders to have `is_buy_order` set to `true`.
   *
   * @esi_example esi.characters(1, 'token').structures(2).orders() orders=buy&typeId get_markets_structures_structure_id
   *
   * @param typeId {Number} The type id to query from the market
   * @return {Promise.<Array.<Object>>} A Promise that resolves to the response
   *     of the request
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
   * @esi_example esi.characters(1, 'token').structures(2).orders() orders=sell&typeId get_markets_structures_structure_id
   *
   * @param typeId {Number} The type id to query from the market
   * @return {Promise.<Array.<Object>>} A Promise that resolves to the response
   *     of the request
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
   * @esi_example esi.characters(1, 'token').structures(2).orders() orders=all&typeId get_markets_structures_structure_id
   *
   * @param typeId {Number} The type id to query from the market
   * @return {Promise.<Array.<Object>>} A Promise that resolves to the response
   *     of the request
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
class Structures extends CallableInstance {
  /**
   * Create a new Structures function using the given `agent` and tied to
   * the character.
   *
   * @param agent {ESIAgent} The ESI agent
   * @param characterId {Number} The character whose structures are accessed
   * @param token {String} SSO access token for the character
   * @constructor
   */
  constructor(agent, characterId, token) {
    super(id => this.get(id));
    this._agent = agent;
    this._id = characterId;
    this._token = token;

    this._search = null;
  }

  /**
   * A Search module instance configured to search over the `'structure'`
   * type and linked to the character.
   *
   * @esi_example esi.characters(1, 'token').structures.search('text') category=[structure] get_characters_character_id_search
   *
   * @type {Search}
   */
  get search() {
    if (!this._search) {
      this._search = new Search(this._agent, ['structure'], this._id, this._token);
    }
    return this._search;
  }

  /**
   * Create a new Structure end point targeting the particular structure by
   * `id`.
   *
   * @param id {Number} The structure id
   * @returns {Structure}
   */
  get(id) {
    return new Structure(this._agent, id, this._token);
  }
}

module.exports = Structures;
