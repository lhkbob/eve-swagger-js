import { ESIAgent } from '../../internal/esi-agent';
import { Responses, esi } from '../../esi';

import * as r from '../../internal/resource-api';
import { MappedTypes } from './types';

/**
 * The API specification for all variants that access information about an
 * in-game market group or multiple market groups. This interface will not be
 * used directly, but will be filtered through some mapper, such as {@link
    * Async} or {@link Mapped} depending on what types of ids are being
    * accessed. However, this allows for a concise and consistent specification
    * for all variants: single, multiple, and all market groups.
 *
 * When mapped, each key defined in this interface becomes a function that
 * returns a Promise resolving to the key's type, or a collection related to
 * the
 * key's type if multiple market groups are being accessed at once.
 *
 * This is an API wrapper over the end points handling market groups in the
 * [market](https://esi.tech.ccp.is/latest/#/market) ESI endpoints.
 */
export interface MarketGroupAPI {
  details: Responses['get_markets_groups_market_group_id'];
}

/**
 * An api adapter for accessing various details of a single in-game market
 * group, specified by a provided id when the api is instantiated.
 */
export class MarketGroup extends r.impl.SimpleResource implements r.Async<MarketGroupAPI> {
  private members_: MappedTypes | undefined;

  constructor(private agent: ESIAgent, id: number) {
    super(id);
  }

  /**
   * @returns Information about the market group
   */
  details() {
    return getDetails(this.agent, this.id_);
  }

  /**
   * @returns A MappedTypes instance tied to the types defined in the details of
   *    this market group
   */
  get members(): MappedTypes {
    if (this.members_ === undefined) {
      this.members_ = new MappedTypes(this.agent,
          () => this.details().then(result => result.types));
    }
    return this.members_!;
  }
}

/**
 * An api adapter for accessing various details of multiple market group ids,
 * specified by a provided an array or set of ids when the api is instantiated.
 */
export class MappedMarketGroups extends r.impl.SimpleMappedResource implements r.Mapped<MarketGroupAPI> {
  constructor(private agent: ESIAgent, ids: number[] | Set<number>) {
    super(ids);
  }

  /**
   * @returns MarketGroup details mapped by marketGroup id
   */
  details() {
    return this.getResource(id => getDetails(this.agent, id));
  }
}

/**
 * An api adapter for accessing various details about every market group in the
 * game. Even though a route exists to get all group ids at once, due to their
 * quantity, the API provides asynchronous iterators for the rest of their
 * details.
 */
export class IteratedMarketGroups extends r.impl.SimpleIteratedResource<number> implements r.Iterated<MarketGroupAPI> {
  constructor(private agent: ESIAgent) {
    super(r.impl.makeArrayStreamer(
        () => agent.request('get_markets_groups', undefined)), id => id);
  }

  /**
   * @returns Iterator over details of all in-game market groups
   */
  details() {
    return this.getResource(id => getDetails(this.agent, id));
  }
}

/**
 * A functional interface for getting APIs for a specific market group, a
 * known set of market group ids, or every market group in the game.
 */
export interface MarketGroups {
  /**
   * Create a new market group api targeting every single market group in the
   * game.
   *
   * @esi_route ids get_markets_groups
   *
   * @returns An IteratedMarketGroups API wrapper
   */
  (): IteratedMarketGroups;

  /**
   * Create a new market group api targeting the particular market group by
   * `id`.
   *
   * @param id The market group id
   * @returns An MarketGroup API wrapper for the given id
   */
  (id: number): MarketGroup;

  /**
   * Create a new market group api targeting the multiple market group ids. If
   * an array is provided, duplicates are removed (although the input array is
   * not modified).
   *
   * @param ids The market group ids
   * @returns A MappedMarketGroups API wrapper for the given ids
   */
  (ids: number[] | Set<number>): MappedMarketGroups;
}

/**
 * Create a new MarketGroups instance that uses the given `agent` to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns A MarketGroups instance
 */
export function makeMarketGroups(agent: ESIAgent): MarketGroups {
  return <MarketGroups> function (ids: number | number[] | Set<number> | undefined) {
    if (ids === undefined) {
      // All MarketGroups since no id
      return new IteratedMarketGroups(agent);
    } else if (typeof ids === 'number') {
      // Single id so single API
      return new MarketGroup(agent, ids);
    } else {
      // Set or array, so mapped API
      return new MappedMarketGroups(agent, ids);
    }
  };
}

function getDetails(agent: ESIAgent, id: number) {
  return agent.request('get_markets_groups_market_group_id',
      { path: { market_group_id: id } });
}
