import { Search } from '../../internal/search';
import { ESIAgent } from '../../internal/esi-agent';
/**
 * An api adapter that provides functions for accessing agent information
 * via the
 * [universe](https://esi.evetech.net/latest/#/Universe) and
 * [search](https://esi.evetech.net/latest/#/Search) ESI end points.
 */
export interface Agents {
    /**
     * A Search module instance configured to search over the `'agent'` type.
     *
     * @esi_route get_search [agent]
     * @esi_example esi.agents.search('text')
     */
    search: Search;
}
/**
 * Create a new {@link Agents} instance that uses the given `agent` to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns An Agents API instance
 */
export declare function makeAgents(agent: ESIAgent): Agents;
