import { Corporation, MappedCorporations } from './corporations';
import { ESIAgent } from '../../internal/esi-agent';
import { makeDefaultSearch } from '../../internal/search';
import { esi } from '../../esi';
import { AuthenticatedCorporation } from './authenticated-corporation';

/**
 * A functional interface for getting APIs for a specific corporation, a known
 * set of corporation ids, the corporation returned by a search query, or every
 * NPC corporation in the game.
 *
 * It also provides a constructor function to get an authenticated corporation
 * API. The authenticated corporation is only available for a single id at a
 * time.
 */
export interface Corporations {
  /**
   * Create a new corporation api targeting the particular corporation by `id`.
   * Note that this is the unauthenticated variant of the corporation API.
   *
   * @param id The corporation id
   * @returns An Corporation API wrapper for the given id
   */
  (id: number): Corporation;

  /**
   * Create a new authenticated corporation api targeting the particular
   * corporation by `id`. This is the authenticated variant of the corporation
   * API and thus requires a valid SSO token. The token should belong to a
   * character within the corporation with the appropriate in-game roles for
   * accessing the desired functions.
   *
   * Some functionality requires a director or staff member role, while others
   * merely requires being a member. See the documentation for each route. If
   * the character corresponding to the SSO token does not have the right
   * in-game roles, an exception will be thrown by the ESI layer.
   *
   * @param id The corporation id
   * @param token The SSO token of the authenticating member
   * @returns An AuthenticatedCorporation API wrapper for the given id
   */
  (id:number, token:string): AuthenticatedCorporation;

  /**
   * Create a new corporation api targeting the multiple corporation ids. If an
   * array is provided, duplicates are removed (although the input array
   * is not modified).
   *
   * @param ids The corporation ids
   * @returns A MappedCorporations API wrapper for the given ids
   */
  (ids: number[] | Set<number>): MappedCorporations;

  /**
   * Create a new corporation api targeting the corporations returned from a
   * search given the `query` text.
   *
   * @esi_route ids get_search [corporation]
   *
   * @param query The search terms
   * @param strict Whether or not the search is strict, defaults to false
   * @returns A MappedCorporations API which accesses corporations based on the
   *    dynamic search results
   */
  (query: string, strict?: boolean): MappedCorporations;

  /**
   * Create a new corporation api targeting the defined NPC corporations.
   *
   * @esi_route ids get_corporations_npccorps
   *
   * @returns A MappedCorporations linked to the dynamic list of NPC corps
   *     in-game
   */
  npcs(): MappedCorporations;
}

/**
 * Create a new corporations API that uses the given `agent` to make its
 * HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns A new Corporations
 */
export function makeCorporations(agent: ESIAgent): Corporations {
  const corpSearch = makeDefaultSearch(agent, esi.SearchCategory.CORPORATION);

  let factory = <Corporations> function (ids: number | number[] | Set<number> | string,
      strictOrToken: boolean | string = false) {
    if (typeof ids === 'number') {
      // Single id variant but check for SSO token to possibly authenticate
      if (typeof strictOrToken === 'string') {
        return new AuthenticatedCorporation(agent, strictOrToken, ids);
      } else {
        return new Corporation(agent, ids);
      }
    } else if (typeof ids === 'string') {
      // Search variant (which only permits the second argument to be a boolean)
      return new MappedCorporations(agent, () => corpSearch(ids, <boolean> strictOrToken));
    } else {
      // ids is a set or array so just a plain mapped corp
      return new MappedCorporations(agent, ids);
    }
  };

  // Add npcs() function
  factory.npcs = function () {
    return new MappedCorporations(agent,
        () => agent.request('get_corporations_npccorps', undefined));
  };

  return factory;
}