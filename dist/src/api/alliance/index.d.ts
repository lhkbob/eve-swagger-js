import { ESIAgent } from '../../internal/esi-agent';
import { Alliance, MappedAlliances, IteratedAlliances } from './alliances';
import { AuthenticatedAlliance } from './authenticated-alliance';
/**
 * A functional interface for getting APIs for a specific alliance, a known
 * set of alliance ids, the alliances returned by a search query, or every
 * alliance in the game.
 */
export interface Alliances {
    /**
     * Create a new alliance api targeting every single alliance in the game.
     *
     * @esi_route ids get_alliances
     *
     * @returns An IteratedAlliances API wrapper
     */
    (): IteratedAlliances;
    /**
     * Create a new alliance api targeting the particular alliance by `id`.
     *
     * @param id The alliance id
     * @returns An Alliance API wrapper for the given id
     */
    (id: number): Alliance;
    /**
     * Create a new authenticated alliance api targeting the particular
     * alliance by `id`. This is the authenticated variant of the corporation
     * API and thus requires a valid SSO token. The token should belong to a
     * character within the alliance with the appropriate in-game roles for
     * accessing the desired functions.
     *
     * Some functionality requires a director or staff member role, while others
     * merely requires being a member. See the documentation for each route. If
     * the character corresponding to the SSO token does not have the right
     * in-game roles, an exception will be thrown by the ESI layer.
     *
     * @param id The alliance id
     * @param token The SSO token of the authenticating member
     * @returns An AuthenticatedAlliance API wrapper for the given id
     */
    (id: number, token: string): AuthenticatedAlliance;
    /**
     * Create a new alliance api targeting the multiple alliance ids. If an
     * array is provided, duplicates are removed (although the input array
     * is not modified).
     *
     * @param ids The alliance ids
     * @returns A MappedAlliances API wrapper for the given ids
     */
    (ids: number[] | Set<number>): MappedAlliances;
    /**
     * Create a new alliance api targeting the alliances returned from a
     * search given the `query` text.
     *
     * @esi_route ids get_search [alliance]
     *
     * @param query The search terms
     * @param strict Whether or not the search is strict, defaults to false
     * @returns A MappedAlliances API which accesses alliances based on the
     *    dynamic search results
     */
    (query: string, strict?: boolean): MappedAlliances;
}
/**
 * Create a new alliances API that uses the given `agent` to make its
 * HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns A new Alliances
 */
export declare function makeAlliances(agent: ESIAgent): Alliances;
