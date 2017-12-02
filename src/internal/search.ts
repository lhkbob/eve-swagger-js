import { ESIAgent, SSOAgent } from './esi-agent';
import { esi } from '../esi';

import * as r from './resource-api';

/**
 * An api adapter over the end points handling search and character search via
 * functions in the [search](https://esi.tech.ccp.is/latest/#/Search) ESI
 * endpoints. Note that the search results are filtered to a specific category
 * chosen when the Search instance was created.
 */
export interface Search {
  /**
   * Search for matching IDs in EVE given the terms in `text`. This is the
   * non-strict search variant. The category of the returned IDs and whether or
   * not the search uses the character end point is dependent on the source of
   * the Search instance.
   *
   * @param text The search terms of the query
   * @param strict Whether or not the search is strict, defaults to false
   * @returns IDs satisfying the search terms for a non-strict search
   */
  (text: string, strict?: boolean): Promise<number[]>;
}

/**
 * Create a new {@link Search} instance that makes request with `agent`,
 * searches within the given category and uses the character-search end point
 * attached to the `character`. It requires an access `token` associated with
 * the character.
 *
 * @param agent The agent to execute HTTP requests with
 * @param category The search category results are limited to
 * @returns A Search instance that can be used to run character search queries
 */
export function makeCharacterSearch(agent: SSOAgent<number | r.impl.IDProvider>,
    category: esi.character.SearchCategory): Search {
  return function (text: string, strict: boolean = false) {
    return getCharacterSearch(agent, category, text, strict);
  };
}

/**
 * Create a new {@link Search} instance that makes request with `agent`,
 * searches within the given category and uses the default search space.
 *
 * @param agent The agent to execute HTTP requests with
 * @param category The search category results are limited to
 * @returns A Search instance that can be used to run search queries
 */
export function makeDefaultSearch(agent: ESIAgent,
    category: esi.SearchCategory): Search {
  return function (text: string, strict: boolean = false) {
    return agent.request('get_search', {
      query: { 'categories': [category], 'search': text, 'strict': strict }
    })
    .then(result => {
      return <number[]> ((result as any)[category]);
    });
  };
}

async function getCharacterSearch(agent: SSOAgent<number | r.impl.IDProvider>,
    category: esi.character.SearchCategory, query: string, strict: boolean) {
  let character: number;
  if (typeof agent.id === 'number') {
    character = agent.id;
  } else {
    character = await agent.id();
  }

  return agent.agent.request('get_characters_character_id_search', {
    path: { 'character_id': character },
    query: { 'categories': [category], 'search': query, 'strict': strict }
  }, agent.ssoToken)
  .then(result => {
    return <number[]> ((result as any)[category]);
  });
}