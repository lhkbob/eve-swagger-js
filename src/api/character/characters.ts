import { getNames } from '../../internal/names';
import { getBatchedValues } from '../../internal/batch';
import { ESIAgent } from '../../internal/esi-agent';
import { Responses, esi } from '../../esi';
import * as r from '../../internal/resource-api';

/**
 * The API specification for all variants that access information about a
 * character or multiple characters. This interface will not be used
 * directly, but will be filtered through some mapper, such as {@link Async} or
 * {@link Mapped} depending on what types of ids are being accessed. However,
 * this allows for a concise and consistent specification for all variants:
 * single, multiple, and all characters.
 *
 * When mapped, each key defined in this interface becomes a function that
 * returns a Promise resolving to the key's type, or a collection related to the
 * key's type if multiple characters are being accessed at once.
 *
 * This is an API wrapper over the end points handling characters via
 * functions in the [character](https://esi.tech.ccp.is/latest/#/Character)
 * ESI endpoints.
 */
export interface CharacterAPI {
  details: Responses['get_characters_character_id'];
  history: Responses['get_characters_character_id_corporationhistory'];
  portraits: Responses['get_characters_character_id_portrait'];
  affiliations: esi.character.Affiliation;
  names: string;
}


/**
 * An api adapter that provides functions for viewing public (non-authenticated)
 * information about a specific character  via functions in the
 * [character](https://esi.tech.ccp.is/latest/#/Character) ESI endpoints.
 */
export class Character extends r.impl.SimpleResource implements r.Async<CharacterAPI> {
  constructor(private agent: ESIAgent, id: number) {
    super(id);
  }

  /**
   * @returns Public information about the specified character
   */
  details() {
    return getDetails(this.agent, this.id_);
  }

  /**
   * @returns Image URLs for the character's portrait
   */
  portraits() {
    return getPortrait(this.agent, this.id_);
  }

  /**
   * @returns The character's corporation history
   */
  history() {
    return getHistory(this.agent, this.id_);
  }

  /**
   * @esi_route ~get_characters_character_id
   *
   * @returns The character's corporation, and optionally alliance and faction
   *    affiliations
   */
  affiliations() {
    return this.details()
    .then(result => ({
      character_id: this.id_,
      faction_id: result.faction_id,
      alliance_id: result.alliance_id,
      corporation_id: result.corporation_id,
    }));
  }

  /**
   * @esi_route ~get_characters_character_id
   *
   * @returns The name of the character
   */
  names() {
    return this.details().then(result => result.name);
  }
}

/**
 * An api adapter for accessing various details of multiple characters,
 * specified by a provided an array, set of ids, or search query when the api is
 * instantiated.
 */
export class MappedCharacters extends r.impl.SimpleMappedResource implements r.Mapped<CharacterAPI> {
  constructor(private agent: ESIAgent,
      ids: number[] | Set<number> | r.impl.IDSetProvider) {
    super(ids);
  }

  /**
   * @returns Details for the characters, mapped by their id
   */
  details() {
    return this.getResource(id => getDetails(this.agent, id));
  }

  /**
   * @returns Portrait URLs for the characters, mapped by their id
   */
  portraits() {
    return this.getResource(id => getPortrait(this.agent, id));
  }

  /**
   * @returns Corporation histories for the characters, mapped by their id
   */
  history() {
    return this.getResource(id => getHistory(this.agent, id));
  }

  /**
   * @esi_route post_characters_affiliation
   *
   * @returns Corporation, alliance, and faction affiliations for the
   *     characters, mapped by their id
   */
  affiliations() {
    return this.arrayIDs()
    .then(ids => getBatchedValues(ids,
        idSet => this.agent.request('post_characters_affiliation',
            { body: idSet }), e => [e.character_id, e], 1000));
  }

  /**
   * @esi_route post_universe_names [character]
   * @esi_route get_characters_names
   *
   * @returns Character name mapped by their id
   */
  names() {
    return this.arrayIDs().then(ids => {
      if (ids.length > 100) {
        return getNames(this.agent, esi.universe.NameCategory.CHARACTER, ids);
      } else {
        return this.agent.request('get_characters_names',
            { query: { 'character_ids': ids } })
        .then(results => {
          let map = new Map();
          for (let r of results) {
            map.set(r.character_id, r.character_name);
          }
          return map;
        });
      }
    });
  }
}

function getDetails(agent: ESIAgent, id: number) {
  return agent.request('get_characters_character_id',
      { path: { character_id: id } });
}

function getPortrait(agent: ESIAgent, id: number) {
  return agent.request('get_characters_character_id_portrait',
      { path: { character_id: id } });
}

function getHistory(agent: ESIAgent, id: number) {
  return agent.request('get_characters_character_id_corporationhistory',
      { path: { character_id: id } });
}
