import { Character, MappedCharacters } from './characters';
import { AuthenticatedCharacter } from './authenticated-character';
import { ESIAgent } from '../../internal/esi-agent';
/**
 * A functional interface for getting APIs for a specific character, a known
 * set of character ids, or the characters returned by a search query.
 */
export interface Characters {
    /**
     * Create a new Character end point targeting the particular
     * character by `id`.
     *
     * @param id The character id
     * @returns The unauthenticated API for the specific character
     */
    (id: number): Character;
    /**
     * Create a new AuthenticatedCharacter end point targeting the particular
     * character by `id`, authenticated with the given access `token`.
     *
     * @param id The character id
     * @param token The SSO access token for the character
     * @returns The authenticated API for the specific character
     */
    (id: number, token: string): AuthenticatedCharacter;
    /**
     * Create a new character api targeting the multiple character ids. If an
     * array is provided, duplicates are removed (although the input array
     * is not modified).
     *
     * @param ids The character ids
     * @returns A MappedCharacters API wrapper for the given ids
     */
    (ids: number[] | Set<number>): MappedCharacters;
    /**
     * Create a new character api targeting the characters returned from a
     * search given the `query` text.
     *
     * @esi_route ids get_search [character]
     *
     * @param query The search terms
     * @param strict Whether or not the search is strict, defaults to false
     * @returns A MappedCharacters API which accesses characters based on the
     *    dynamic search results
     */
    (query: string, strict?: boolean): MappedCharacters;
}
/**
 * Create a new {@link Characters} instance that uses the given `agent` to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns A Characters API instance
 */
export declare function makeCharacters(agent: ESIAgent): Characters;
