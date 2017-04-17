const ExtendableFunction = require('../../internal/ExtendableFunction');
const [PageHandler,] = require('../../internal/PageHandler');
const Search = require('../Search');

const _names = require('../../internal/names');

/**
 * An api adapter for dealing with a single item group, currently only
 * supporting fetching simple information.
 */
class Group {
  /**
   * Create a new Group for the given `agent` provider and specific `groupId`.
   *
   * @param agent {ESIAgent} The agent used to generate web requests
   * @param groupId {Number} The group id that is used for all requests
   * @constructor
   */
  constructor(agent, groupId) {
    this._agent = agent;
    this._id = groupId;
  }

  /**
   * @esi_route get_universe_groups_group_id
   *
   * @return {Promise.<Object>}
   */
  info() {
    return this._agent.noAuth.get('/v1/universe/groups/{group_id}/',
        { path: { 'group_id': this._id } });
  }
}

/**
 * An api adapter that provides functions for accessing item group information
 * via the [universe](https://esi.tech.ccp.is/latest/#/Universe) ESI end points.
 * You should not usually instantiate this directly as its constructor requires
 * an internal api instance.
 *
 * This is a function class so instances of `Groups` are functions and can be
 * invoked directly, besides accessing its members. Its default function action
 * is equivalent to {@link Groups#get get} or {@link Groups#all all} if no id is
 * provided.
 */
class Groups extends ExtendableFunction {
  /**
   * Create a new Groups instance using the given `agent`.
   *
   * @param agent {ESIAgent} The ESI agent
   * @constructor
   */
  constructor(agent) {
    super(id => (id ? this.get(id) : this.all()));
    this._agent = agent;
    this._all = new PageHandler(page => this.all(page));
  }

  /**
   * Create a new Group end point targeting the particular group by `id`.
   *
   * @param id {Number} The group id
   * @returns {Group}
   */
  get(id) {
    return new Group(this._agent, id);
  }

  /**
   * @esi_route get_universe_groups
   *
   * @param page {Number} If 0, then all pages are returned concatenated into a
   *     single array.
   * @return {Promise.<Array.<Number>>}
   */
  all(page = 0) {
    if (page == 0) {
      return this._all.getAll();
    } else {
      return this._agent.noAuth.get('/v1/universe/groups/',
          { query: { 'page': page } });
    }
  };
}

/**
 * An api adapter for dealing with a single item category, currently only
 * supporting fetching simple information.
 */
class Category {
  /**
   * Create a new Category for the given `agent` provider and specific
   * `categoryId`.
   *
   * @param agent {ESIAgent} The agent used to generate web requests
   * @param categoryId {Number} The category id that is used for all requests
   * @constructor
   */
  constructor(agent, categoryId) {
    this._agent = agent;
    this._id = categoryId;
  }

  /**
   * @esi_route get_universe_categories_category_id
   *
   * @return {Promise.<Object>}
   */
  info() {
    return this._agent.noAuth.get('/v1/universe/categories/{category_id}/',
        { path: { 'category_id': this._id } });
  }
}

/**
 * An api adapter that provides functions for accessing item category
 * information via the [universe](https://esi.tech.ccp.is/latest/#/Universe) ESI
 * end points. You should not usually instantiate this directly as its
 * constructor requires an internal api instance.
 *
 * This is a function class so instances of `Categories` are functions and can
 * be invoked directly, besides accessing its members. Its default function
 * action is equivalent to {@link Categories#get get} or {@link Categories#all
 * all} if no id is provided.
 */
class Categories extends ExtendableFunction {
  /**
   * Create a new Categories instance using the given `agent`.
   *
   * @param agent {ESIAgent} The ESI agent
   * @constructor
   */
  constructor(agent) {
    super(id => (id ? this.get(id) : this.all()));
    this._agent = agent;
  }

  /**
   * Create a new Category end point targeting the particular category by `id`.
   *
   * @param id {Number} The category id
   * @returns {Category}
   */
  get(id) {
    return new Category(this._agent, id);
  }

  /**
   * @esi_route get_universe_categories
   *
   * @return {Promise.<Array.<Number>>}
   */
  all() {
    return this._agent.noAuth.get('/v1/universe/categories/');
  }
}

/**
 * An api adapter for dealing with a single item type, currently only supporting
 * fetching simple information.
 */
class Type {
  /**
   * Create a new Type for the given `agent` provider and specific
   * `typeId`.
   *
   * @param agent {ESIAgent} The agent used to generate web requests
   * @param typeId {Number} The type id that is used for all requests
   * @constructor
   */
  constructor(agent, typeId) {
    this._agent = agent;
    this._id = typeId;
  }

  /**
   * @esi_route get_universe_types_type_id
   *
   * @return {Promise.<Object>}
   */
  info() {
    return this._agent.noAuth.get('/v2/universe/types/{type_id}/',
        { path: { 'type_id': this._id } });
  }
}

/**
 * An api adapter that provides functions for accessing item type information
 * via the
 * [universe](https://esi.tech.ccp.is/latest/#/Universe) and
 * [search](https://esi.tech.ccp.is/latest/#/Search) ESI end points.
 * You should not usually instantiate this directly as its constructor requires
 * an internal api instance.
 *
 * This is a function class so instances of `Types` are functions and can
 * be invoked directly, besides accessing its members. Its default function
 * action is equivalent to {@link Types#get get} or {@link Types#all all} if
 * no id is provided.
 */
class Types extends ExtendableFunction {
  /**
   * Create a new Types instance using the given `agent`.
   *
   * @param agent {ESIAgent} The ESI agent
   * @constructor
   */
  constructor(agent) {
    super(id => (id ? this.get(id) : this.all()));
    this._agent = agent;
    this._all = new PageHandler(page => this.all(page));

    this._search = null;
    this._cats = null;
    this._groups = null;
  }

  /**
   * A Categories instance configured with the same api.
   *
   * @type {Categories}
   */
  get categories() {
    if (!this._cats) {
      this._cats = new Categories(this._agent);
    }
    return this._cats;
  }

  /**
   * A Groups instance configured with the same api.
   *
   * @type {Groups}
   */
  get groups() {
    if (!this._groups) {
      this._groups = new Groups(this._agent);
    }
    return this._groups;
  }

  /**
   * A Search module instance configured to search over the `'inventorytype'`
   * type.
   *
   * @type {Search}
   */
  get search() {
    if (!this._search) {
      this._search = new Search(this._agent, ['inventorytype']);
    }
    return this._search;
  }

  /**
   * Create a new Type end point targeting the particular type by `id`.
   *
   * @param id {Number} The type id
   * @returns {Type}
   */
  get(id) {
    return new Type(this._agent, id);
  }

  /**
   * @esi_route get_markets_prices
   *
   * @return {Promise.<Array.<Object>>}
   */
  prices() {
    return this._agent.noAuth.get('/v1/markets/prices/');
  }

  /**
   * @esi_route get_universe_types
   *
   * @param page {Number} If 0, then all pages are returned, concatenated as a
   *     single array.
   * @return {Promise.<Array.<Number>>}
   */
  all(page = 0) {
    if (page == 0) {
      return this._all.getAll();
    } else {
      return this._agent.noAuth.get('/v1/universe/types/',
          { query: { 'page': page } });
    }
  }

  /**
   * @esi_route post_universe_names
   *
   * Results will only includes matches with the type category.
   * If `ids` is longer than the reported maximum length for ESI, the array
   * will be split into smaller chunks and multiple requests will be made and
   * then concatenated back together.
   *
   * @esi_returns {!category}
   *
   * @param {Array.<Number>} ids If no ids are provided, then all names are
   *     returned
   * @return {Promise.<Array.<Object>>}
   */
  names(ids = []) {
    if (!ids || ids.length == 0) {
      return this.all().then(allIds => this.names(allIds));
    } else {
      return _names(this._agent, 'inventory_type', ids);
    }
  }
}

module.exports = Types;
