import { ESIAgent } from './esi-agent';
import { esi } from './esi-types';
/**
 * Look up the names of a set of ids, restricted to a particular name category.
 * This utility function automatically splits large arrays of ids into lists of
 * 500 elements and then recombines the results. It also maps the response data
 * from the internal ESI representation into a more useful Map from id to name.
 *
 * @param agent The agent making requests
 * @param category The category of names to look up
 * @param ids The list of ids to resolve, should not contain duplicates
 * @returns Promise resolving to a Map from id to name
 */
export declare function getNames(agent: ESIAgent, category: esi.universe.NameCategory, ids: number[]): Promise<Map<any, any>>;
/**
 * Look up the names of a set of ids, which can be from any of the categories.
 * Because the response can have ids from multiple categories, it is returned
 * without simplifying into the Map type. Like {@link getNames} it automatically
 * splits large arrays into multiple requests.
 *
 * @param agent The agent making requests
 * @param ids The names to resolve, from any category, but should not contain
 *  duplicates
 * @returns Promise resolving to an array of esi.universe.Name instances
 */
export declare function getAllNames(agent: ESIAgent, ids: number[]): Promise<esi.universe.Name[]>;
