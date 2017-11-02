import { ESIAgent } from './esi-agent';
import { getBatchedValues, getIteratedValues, getRawValues } from './batch';
import { esi } from '../esi';

/**
 * Look up the names of a set of ids, restricted to a particular name category.
 * This utility function automatically splits large arrays of ids into lists of
 * 500 elements and then recombines the results. It also maps the response data
 * from the internal ESI representation into a more useful Map from id to name.
 *
 * @esi_route post_universe_names
 *
 * @param agent The agent making requests
 * @param category The category of names to look up
 * @param ids The list of ids to resolve, should not contain duplicates
 * @returns Promise resolving to a Map from id to name
 */
export function getNames(agent: ESIAgent, category: esi.universe.NameCategory,
    ids: number[]) {
  return getBatchedValues(ids,
      idSet => getFilteredUniverseNames(agent, idSet, category),
      n => [n.id, n.name], UNIVERSE_NAMES_BATCH_SIZE);
}

/**
 * Look up the names corresponding to a stream of ids. This automatically
 * batches the ids and attempts to remove duplicates, although if they are
 * sufficiently far apart in the stream an id could show up in the output stream
 * again. The guarantee is that requests will not fail due to duplicates in the
 * batches.
 *
 * @esi_route post_universe_names
 *
 * @param agent The agent making requests
 * @param category The category of names to look up
 * @param ids The list of ids to resolve, ideally should not contain duplicates
 * @returns Iterator resolving to a series of tuples pairing id to name
 */
export function getIteratedNames(agent: ESIAgent,
    category: esi.universe.NameCategory,
    ids: AsyncIterableIterator<number>): AsyncIterableIterator<[number, string]> {
  return getIteratedValues(ids,
      idSet => getFilteredUniverseNames(agent, idSet, category),
      n => [n.id, n.name], UNIVERSE_NAMES_BATCH_SIZE);
}

/**
 * Look up the names of a set of ids, which can be from any of the categories.
 * Because the response can have ids from multiple categories, it is returned
 * without simplifying into the Map type. Like {@link getNames} it
 * automatically splits large arrays into multiple requests.
 *
 * @esi_route post_universe_names
 *
 * @param agent The agent making requests
 * @param ids The names to resolve, from any category, but should not contain
 *  duplicates
 * @returns Promise resolving to an array of esi.universe.Name instances
 */
export function getAllNames(agent: ESIAgent, ids: number[]) {
  return getRawValues(ids, idSet => postUniverseNames(agent, idSet),
      UNIVERSE_NAMES_BATCH_SIZE);
}

const UNIVERSE_NAMES_BATCH_SIZE = 1000;

function postUniverseNames(agent: ESIAgent,
    ids: number[]): Promise<esi.universe.Name[]> {
  return agent.request('post_universe_names', { body: ids });
}

function getFilteredUniverseNames(agent: ESIAgent, ids: number[],
    category: esi.universe.NameCategory): Promise<esi.universe.Name[]> {
  return postUniverseNames(agent, ids)
  .then(result => result.filter(r => r.category === category));
}
