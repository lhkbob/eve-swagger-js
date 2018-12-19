import { getNames } from '../..//internal/names';
import { makeDefaultSearch, Search } from '../../internal/search';
import { ESIAgent } from '../../internal/esi-agent';
import { Responses, esi } from '../../../gen/esi';

/**
 * An api adapter over the end points handling factions via functions in the
 * [universe](https://esi.evetech.net/latest/#/Universe) and
 * [search](https://esi.evetech.net/latest/#/Search) ESI endpoints.
 */
export interface Factions {
  /**
   * @esi_example esi.factions()
   *
   * @returns Information about all factions in Eve
   */
  (): Promise<Responses['get_universe_factions']>;

  /**
   * A Search module instance configured to search over the `'faction'`
   * type.
   *
   * @esi_route get_search [faction]
   * @esi_example esi.factions.search('text')
   */
  search: Search;
}

/**
 * Create a new {@link Factions} instance that uses the given `agent` to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns A Factions API instance
 */
export function makeFactions(agent: ESIAgent): Factions {
  let functor = <Factions> <any> function () {
    return agent.request('get_universe_factions', undefined);
  };
  functor.search = makeDefaultSearch(agent, esi.SearchCategory.FACTION);
  return functor;
}
