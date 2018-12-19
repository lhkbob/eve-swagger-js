import { Search, makeDefaultSearch } from '../../internal/search';
import { getNames } from '../../internal/names';
import {
  PaginatedLoader, makePageBasedLoader
} from '../../internal/page-loader';
import { ESIAgent } from '../../internal/esi-agent';
import { Responses, esi } from '../../../gen/esi';

/**
 * An api adapter for dealing with a single item group, currently only
 * supporting fetching simple information.
 */
export interface Group {
  /**
   * @esi_route get_universe_groups_group_id
   * @esi_example esi.types.groups(id).info()
   *
   * @return Information about the item group
   */
  info(): Promise<Responses['get_universe_groups_group_id']>;

  /**
   * @returns The group id
   */
  id(): Promise<number>;
}

/**
 * An api adapter that provides functions for accessing item group information
 * via the [universe](https://esi.evetech.net/latest/#/Universe) ESI end points.
 */
export interface Groups {
  /**
   * @esi_example esi.types.groups()
   *
   * @return All group ids
   */
  (): Promise<Responses['get_universe_groups']>;

  /**
   * Create a new Group end point targeting the particular group by `id`.
   *
   * @param id The group id
   * @returns A Group API wrapper
   */
  (id: number): Group;
}

/**
 * An api adapter for dealing with a single market group, currently only
 * supporting fetching simple information.
 */
export interface MarketGroup {
  /**
   * @esi_example esi.types.marketGroups(id).info()
   *
   * @return Information about the given market group
   */
  info(): Promise<Responses['get_markets_groups_market_group_id']>;

  /**
   * @returns The market group id
   */
  id(): Promise<number>;
}

/**
 * An api adapter that provides functions for accessing market group information
 * via the [market](https://esi.evetech.net/latest/#/Market) ESI end points.
 */
export interface MarketGroups {
  /**
   * @esi_route get_markets_groups
   * @esi_example esi.types.marketGroups()
   *
   * @return All market group ids
   */
  (): Promise<Responses['get_markets_groups']>;

  /**
   * Create a new MarketGroup end point targeting the particular group by `id`.
   *
   * @param id The market group id
   * @returns A MarketGroup API wrapper for the given id
   */
  (id: number): MarketGroup;
}

/**
 * An api adapter for dealing with a single item category, currently only
 * supporting fetching simple information.
 */
export interface Category {
  /**
   * @esi_example esi.types.categories(id).info()
   *
   * @return Information about the item type category
   */
  info(): Promise<Responses['get_universe_categories_category_id']>;

  /**
   * @returns The category id
   */
  id(): Promise<number>;
}

/**
 * An api adapter that provides functions for accessing item category
 * information via the [universe](https://esi.evetech.net/latest/#/Universe) ESI
 * end points.
 */
export interface Categories {
  /**
   * @esi_route get_universe_categories
   * @esi_example esi.types.categories()
   *
   * @return All item category ids
   */
  (): Promise<Responses['get_universe_categories']>;

  /**
   * Create a new Category end point targeting the particular category by `id`.
   *
   * @param id The category id
   * @returns A Category API wrapper
   */
  (id: number): Category;
}

/**
 * An api adapter for dealing with a single item type, currently only supporting
 * fetching simple information.
 */
export interface Type {
  /**
   * @esi_example esi.types(id).info()
   *
   * @return Information about a specific item type
   */
  info(): Promise<Responses['get_universe_types_type_id']>;

  /**
   * @returns The type id
   */
  id(): Promise<number>;
}

/**
 * An api adapter that provides functions for accessing item type information
 * via the
 * [universe](https://esi.evetech.net/latest/#/Universe) and
 * [search](https://esi.evetech.net/latest/#/Search) ESI end points.
 */
export interface Types {
  /**
   * @esi_example esi.types()
   *
   * @return Get all type ids
   */
  (): Promise<Responses['get_universe_types']>;

  /**
   * Create a new Type end point targeting the particular type by `id`.
   *
   * @param id The type id
   * @returns A Type API wrapper for the specific type
   */
  (id: number): Type;

  /**
   * A Categories API instance.
   */
  categories: Categories;

  /**
   * A Groups API instance.
   */
  groups: Groups;

  /**
   * A MarketGroups API instance.
   */
  marketGroups: MarketGroups;

  /**
   * A Search module instance configured to search over the `'inventorytype'`
   * type.
   *
   * @esi_route get_search [inventorytype]
   * @esi_example esi.types.search('text')
   */
  search: Search;

  /**
   * @esi_example esi.types.prices()
   *
   * @return Average price information for all item types
   */
  prices(): Promise<Responses['get_markets_prices']>;

  /**
   * @esi_route post_universe_names [inventory_type]
   * @esi_example esi.types.names()
   *
   * @param ids If no ids are provided, then all names are  returned
   * @return A Map from type id to name
   */
  names(ids?: number[]): Promise<Map<number, string>>;
}

/**
 * Create a new {@link Types} instance that uses the given `agent` to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns An Types API instance
 */
export function makeTypes(agent: ESIAgent): Types {
  const allTypes = makePageBasedLoader(
      page => agent.request('get_universe_types', { query: { page: page } }));
  const allGroups = makePageBasedLoader(
      page => agent.request('get_universe_groups', { query: { page: page } }));

  let types = <Types> <any> function (id?: number) {
    if (id === undefined) {
      return allTypes.getAll();
    } else {
      return new TypeImpl(agent, id);
    }
  };

  types.categories = <Categories> <any> function (id?: number) {
    if (id === undefined) {
      return agent.request('get_universe_categories', undefined);
    } else {
      return new CategoryImpl(agent, id);
    }
  };
  types.marketGroups = <MarketGroups> <any> function (id?: number) {
    if (id === undefined) {
      return agent.request('get_markets_groups', undefined);
    } else {
      return new MarketGroupImpl(agent, id);
    }
  };
  types.groups = <Groups> <any> function (id?: number) {
    if (id === undefined) {
      return allGroups.getAll();
    } else {
      return new GroupImpl(agent, id);
    }
  };

  types.search = makeDefaultSearch(agent, esi.SearchCategory.INVENTORYTYPE);
  types.prices = function () {
    return agent.request('get_markets_prices', undefined);
  };
  types.names = function (ids?: number[]) {
    if (ids === undefined) {
      return types().then(allIds => types.names(allIds));
    } else {
      return getNames(agent, esi.universe.NameCategory.INVENTORY_TYPE, ids);
    }
  };

  return types;
}

class GroupImpl implements Group {
  constructor(private agent: ESIAgent, private id_: number) {
  }

  info() {
    return this.agent.request('get_universe_groups_group_id',
        { path: { group_id: this.id_ } });
  }

  id() {
    return Promise.resolve(this.id_);
  }
}

class MarketGroupImpl implements MarketGroup {
  constructor(private agent: ESIAgent, private id_: number) {
  }

  info() {
    return this.agent.request('get_markets_groups_market_group_id',
        { path: { market_group_id: this.id_ } });
  }

  id() {
    return Promise.resolve(this.id_);
  }
}

class CategoryImpl implements Category {
  constructor(private agent: ESIAgent, private id_: number) {
  }

  info() {
    return this.agent.request('get_universe_categories_category_id',
        { path: { category_id: this.id_ } });
  }

  id() {
    return Promise.resolve(this.id_);
  }
}

class TypeImpl implements Type {
  constructor(private agent: ESIAgent, private id_: number) {
  }

  info() {
    return this.agent.request('get_universe_types_type_id',
        { path: { type_id: this.id_ } });
  }

  id() {
    return Promise.resolve(this.id_);
  }
}
