import {
  PaginatedLoader, makePageBasedLoader
} from '../../internal/page-loader';
import { Search, makeCharacterSearch } from '../../internal/search';
import { ESIAgent, SSOAgent } from '../../internal/esi-agent';
import { Responses, esi } from '../../../gen/esi';
import { CharacterCorporation, makeCharacterCorporation } from './character-corporation';

/**
 * An api adapter that provides functions for accessing various details for a
 * structure accessible by the character, specified by id, via functions in the
 * [universe](https://esi.evetech.net/latest/#/Universe) ESI endpoints.
 */
export interface Structure {
  /**
   * @esi_example esi.characters(1, 'token').structures(2).info()
   *
   * @returns Information about the structure
   */
  info(): Promise<Responses['get_universe_structures_structure_id']>;

  /**
   * @esi_example esi.characters(1, 'token').structures(2).vulnerability({...})
   *
   * @param newSchedule The schedule specification
   * @returns An empty promise that resolves when the new schedule is saved
   */
  // FIXME where does this belong, this is part of the corporation functionality
  vulnerability(newSchedule: esi.corporation.VulnerabilitySchedule[]): Promise<Responses['put_corporations_corporation_id_structures_structure_id']>;

  /**
   * @esi_route get_markets_structures_structure_id [all]
   * @esi_example esi.characters(1, 'token').structures(2).orders()
   *
   * @param page {Number} If not provided, all pages of orders are returned as a
   *     concatenated array.
   * @returns Order details for all types and both buy and sell orders
   */
  orders(page?: number): Promise<Responses['get_markets_structures_structure_id']>;

  /**
   * Get all buy market orders in the structure for the particular item type.
   * This is equivalent to {@link Structure#ordersFor ordersFor} except that it
   * additionally filters orders to have `is_buy_order` set to `true`.
   *
   * @esi_route get_markets_structures_structure_id [buy,typeId]
   * @esi_example esi.characters(1, 'token').structures(2).buyOrdersFor(type)
   *
   * @param typeId The type id to query from the market
   * @return Buy orders for the specific inventory type
   */
  buyOrdersFor(typeId: number): Promise<Responses['get_markets_structures_structure_id']>;

  /**
   * Get all sell market orders in the structure for the particular item type.
   * This is equivalent to {@link Structure#ordersFor ordersFor} except that it
   * additionally filters orders to have `is_buy_order` set to `false`.
   *
   * @esi_route get_markets_structures_structure_id [sell,typeId]
   * @esi_example esi.characters(1, 'token').structures(2).sellOrdersFor(type)
   *
   * @param typeId The type id to query from the market
   * @return Sell orders for the specific inventory type
   */
  sellOrdersFor(typeId: number): Promise<Responses['get_markets_structures_structure_id']>;

  /**
   * Get all market orders in the structure for the particular item type. This
   * is equivalent to {@link Structure#ordersFor ordersFor} except that it
   * additionally filters orders to have `is_buy_order` set to `false`.
   *
   * @esi_route get_markets_structures_structure_id [sell,typeId]
   * @esi_example esi.characters(1, 'token').structures(2).sellOrdersFor(type)
   *
   * @param typeId The type id to query from the market
   * @return Sell orders for the specific inventory type
   */
  sellOrdersFor(typeId: number): Promise<Responses['get_markets_structures_structure_id']>;

  /**
   * Get all market orders in the structure for the given item type from the
   * ESI endpoint. Orders include buy and sell, but are restricted to the
   * selected type id.
   *
   * While the ESI endpoints support native type filtering for regions, this
   * type filtering is implemented in-library for structures. This means that
   * all orders for the structure are requested via {@link Structure.orders
   * orders} and then filtered.
   *
   * @esi_route get_markets_structures_structure_id [typeId]
   * @esi_example esi.characters(1, 'token').structures(2).ordersFor(type)
   *
   * @param typeId The type id to query from the market
   * @return All orders for the specific inventory type
   */
  ordersFor(typeId: number): Promise<Responses['get_markets_structures_structure_id']>;

  /**
   * @returns The structure's id
   */
  id(): Promise<number>;
}

/**
 * An api adapter over the end points handling structures via functions in the
 * [universe](https://esi.evetech.net/latest/#/Universe) and
 * [search](https://esi.evetech.net/latest/#/Search) ESI endpoints.
 */
export interface Structures {
  /**
   * Create a new Structure end point targeting the particular structure by
   * `id`.
   *
   * @param id The structure id
   * @returns A Structure API wrapper
   */
  (id: number): Structure;

  /**
   * A Search module instance configured to search over the `'structure'`
   * type and linked to the character.
   *
   * @esi_route get_characters_character_id_search [structure]
   * @esi_example esi.characters(1, 'token').structures.search('text')
   */
  search: Search;
}

/**
 * Create a new {@link Structures} instance that uses the given character agent
 * to make its HTTP requests to the ESI interface.
 *
 * @param char The character access information
 * @returns An Mail API instance
 */
export function makeStructures(char: SSOAgent): Structures {
  let structures = <Structures> <any> function (id: number) {
    return new StructureImpl(char, id);
  };

  structures.search = makeCharacterSearch(char.agent,
      esi.character.SearchCategory.STRUCTURE, char.id, char.ssoToken);

  return structures;
}

class StructureImpl implements Structure {
  private allOrders: PaginatedLoader<esi.market.Order>;
  private agent: ESIAgent;
  private token: string;
  private corp: CharacterCorporation;

  constructor(agent: SSOAgent, private id_: number) {
    this.agent = agent.agent;
    this.token = agent.ssoToken;
    this.corp = makeCharacterCorporation(agent);
    this.allOrders = makePageBasedLoader(page => this.orders(page));
  }

  info() {
    return this.agent.request('get_universe_structures_structure_id',
        { path: { structure_id: this.id_ } }, this.token);
  }

  vulnerability(newSchedule:esi.corporation.VulnerabilitySchedule[]) {
    return this.corp.id().then(corpID => {
      return this.agent.request(
          'put_corporations_corporation_id_structures_structure_id', {
            path: { corporation_id: corpID, structure_id: this.id_ },
            body: newSchedule
          }, this.token);
    });
  }

  orders(page?: number) {
    if (page === undefined) {
      return this.allOrders.getAll();
    } else {
      return this.agent.request('get_markets_structures_structure_id',
          { path: { structure_id: this.id_ }, query: { page } }, this.token);
    }
  }

  buyOrdersFor(typeId: number) {
    return this.ordersFor(typeId).then(typeOrders => {
      return typeOrders.filter(o => o.is_buy_order);
    });
  }

  sellOrdersFor(typeId: number) {
    return this.ordersFor(typeId).then(typeOrders => {
      return typeOrders.filter(o => !o.is_buy_order);
    });
  }

  ordersFor(typeId: number) {
    return this.orders().then(allOrders => {
      return allOrders.filter(o => o.type_id === typeId);
    });
  }

  id() {
    return Promise.resolve(this.id_);
  }
}
