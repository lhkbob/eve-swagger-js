import { Search, makeDefaultSearch } from '../../internal/search';
import { ESIAgent } from '../../internal/esi-agent';
import { esi } from '../../../gen/esi';
/**
 * An api adapter that provides functions for accessing wormhole information
 * via the
 * [universe](https://esi.evetech.net/latest/#/Universe) and
 * [search](https://esi.evetech.net/latest/#/Search) ESI end points.
 */
export interface Wormholes {
  /**
   * A Search module instance configured to search over the `'wormhole'` type.
   *
   * @esi_route get_search [wormhole]
   * @esi_example esi.wormholes.search('text')
   */
  search: Search;
}

/**
 * Create a new {@link Wormholes} instance that uses the given `agent` to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns An Wormholes API instance
 */
export function makeWormholes(agent:ESIAgent) : Wormholes {
  const search =makeDefaultSearch(agent, esi.SearchCategory.WORMHOLE);
  return {search};
}
