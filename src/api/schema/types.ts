import { makeDefaultSearch } from '../../internal/search';
import { getNames, getIteratedNames } from '../../internal/names';
import { ESIAgent } from '../../internal/esi-agent';
import { Responses, esi } from '../../esi';

import * as r from '../../internal/resource-api';

/**
 * The API specification for all variants that access information about an
 * in-game type or multiple types. This interface will not be used
 * directly, but will be filtered through some mapper, such as {@link Async} or
 * {@link Mapped} depending on what types of ids are being accessed. However,
 * this allows for a concise and consistent specification for all variants:
 * single, multiple, and all types.
 *
 * When mapped, each key defined in this interface becomes a function that
 * returns a Promise resolving to the key's type, or a collection related to
 * the key's type if multiple types are being accessed at once.
 *
 * This is an API wrapper over the end points handling types in the
 * [universe](https://esi.tech.ccp.is/latest/#/Universe) ESI
 * endpoints.
 */
export interface TypeAPI {
  details: Responses['get_universe_types_type_id'];
  prices: esi.market.Price;
  names: string;
}

/**
 * An api adapter for accessing various details of a single in-game type,
 * specified by a provided id when the api is instantiated.
 */
export class Type extends r.impl.SimpleResource implements r.Async<TypeAPI> {
  constructor(private agent: ESIAgent, id: number) {
    super(id);
  }

  /**
   * @returns Information about the type
   */
  details() {
    return getDetails(this.agent, this.id_);
  }

  /**
   * @esi_route ~get_markets_prices
   *
   * @returns Price data for the type
   */
  prices() {
    return getPrices(this.agent)
    .then(all => r.impl.filterArray(all, this.id_, p => p.type_id));
  }

  /**
   * @esi_route ~get_universe_types_type_id
   *
   * @returns The name of the type
   */
  names() {
    return this.details().then(result => result.name);
  }
}

/**
 * An api adapter for accessing various details of multiple type ids,
 * specified by a provided an array or set of ids when the api is instantiated.
 */
export class MappedTypes extends r.impl.SimpleMappedResource implements r.Mapped<TypeAPI> {
  constructor(private agent: ESIAgent,
      ids: number[] | Set<number> | r.impl.IDSetProvider) {
    super(ids);
  }

  /**
   * @returns Type details mapped by type id
   */
  details() {
    return this.getResource(id => getDetails(this.agent, id));
  }

  /**
   * @esi_route ~get_markets_prices
   *
   * @returns Price data for each of the mapped types
   */
  prices() {
    return this.arrayIDs().then(ids => {
      return getPrices(this.agent)
      .then(all => r.impl.filterArrayToMap(all, ids, p => p.type_id));
    });
  }

  /**
   * @esi_route post_universe_names [type]
   *
   * @returns The names for each of the mapped types
   */
  names() {
    return this.arrayIDs()
    .then(ids => getNames(this.agent, esi.universe.NameCategory.INVENTORY_TYPE,
        ids));
  }
}

/**
 * An api adapter for accessing various details about every type in the game.
 */
export class AllTypes extends r.impl.SimpleIteratedResource<number> implements r.Iterated<TypeAPI> {
  constructor(private agent: ESIAgent) {
    // TODO the types end point supports x-max-pages header so the page-loader
    // should return that as well.
    super(r.impl.makePageBasedStreamer(
        page => agent.request('get_universe_types', { query: { page: page } })
        .then(result => <[number[], number | undefined]> [result, undefined]),
        1000), id => id);
  }

  /**
   * @returns Iterator over details of all in-game types
   */
  details() {
    return this.getResource(id => getDetails(this.agent, id));
  }

  /**
   * @esi_route get_markets_prices
   *
   * @returns An iterator over every price-able item type
   */
  async * prices() {
    let prices = await getPrices(this.agent);
    for (let p of prices) {
      yield <[number, esi.market.Price]> [p.type_id, p];
    }
  }

  /**
   * @esi_route post_universe_names [type]
   *
   * @returns Iterator over type names
   */
  names() {
    return getIteratedNames(this.agent,
        esi.universe.NameCategory.INVENTORY_TYPE, this.ids());
  }
}

/**
 * A functional interface for getting APIs for a specific type, a
 * known set of type ids, or every type in the game.
 */
export interface TypeAPIFactory {
  /**
   * Create a new type api targeting every single type in the game.
   *
   * @esi_route ids get_universe_types
   *
   * @returns An AllTypes API wrapper
   */
  (): AllTypes;

  /**
   * Create a new type api targeting the particular type by `id`.
   *
   * @param id The type id
   * @returns An Type API wrapper for the given id
   */
  (id: number): Type;

  /**
   * Create a new type api targeting the multiple type ids. If an
   * array is provided, duplicates are removed (although the input array is not
   * modified).
   *
   * @param ids The type ids
   * @returns A MappedTypes API wrapper for the given ids
   */
  (ids: number[] | Set<number>): MappedTypes;

  /**
   * Create a new type api targeting the types returned from a
   * search given the `query` text.
   *
   * @esi_route ids get_search [type]
   *
   * @param query The search terms
   * @param strict Whether or not the search is strict, defaults to false
   * @returns A MappedTypes API which accesses types based on the
   *    dynamic search results
   */
  (query: string, strict?: boolean): MappedTypes;
}

/**
 * Create a new TypeAPIFactory instance that uses the given `agent` to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns A TypeAPIFactory instance
 */
export function makeTypeAPIFactory(agent: ESIAgent): TypeAPIFactory {
  const typeSearch = makeDefaultSearch(agent, esi.SearchCategory.INVENTORYTYPE);

  return <TypeAPIFactory> function (ids: number | number[] | Set<number> | string | undefined,
      strict: boolean = false) {
    if (ids === undefined) {
      // All types since no id
      return new AllTypes(agent);
    } else if (typeof ids === 'number') {
      // Single id so single API
      return new Type(agent, ids);
    } else if (typeof ids === 'string') {
      // Search query for mapped API
      return new MappedTypes(agent, () => typeSearch(ids, strict));
    } else {
      // Set or array, so mapped API
      return new MappedTypes(agent, ids);
    }
  };
}

function getDetails(agent: ESIAgent, id: number) {
  return agent.request('get_universe_types_type_id', { path: { type_id: id } });
}

function getPrices(agent: ESIAgent) {
  return agent.request('get_markets_prices', undefined);
}
