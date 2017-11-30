import { SSOAgent } from '../../internal/esi-agent';
import { esi } from '../../esi';
import * as r from '../../internal/resource-api';

import {
  Character, CharacterAPI, MappedCharacters
} from '../character/characters';
import { getIteratedValues } from '../../internal/batch';
import { getIteratedNames } from '../../internal/names';

/**
 * The API specification for all variants that access information about a
 * corporation's members or multiple members. This interface will not be
 * used directly, but will be filtered through some mapper, such as {@link
    * Async} or {@link Mapped} depending on what types of ids are being
 * accessed. However, this allows for a concise and consistent specification
 * for all variants: single, multiple, and all members.
 *
 * When mapped, each key defined in this interface becomes a function that
 * returns a Promise resolving to the key's member, or a collection related
 * to the key's member if multiple bases are being accessed at once.
 *
 * This is an API wrapper over the end points handling types in the
 * [corporation](https://esi.tech.ccp.is/latest/#/Corporation) ESI endpoints.
 */
export interface MemberAPI extends CharacterAPI {
  tracking: esi.corporation.MemberDetails;
  roles: esi.corporation.MemberRoles;
  titles: number[];
}

/**
 * An api adapter for accessing various details of a single corporation
 * member, specified by a provided id when the api is instantiated.
 */
export class Member extends r.impl.SimpleResource implements r.Async<MemberAPI> {
  private base_?: Character;

  constructor(private agent: SSOAgent<number | r.impl.IDProvider>, id: number) {
    super(id);
  }

  private get base(): Character {
    if (this.base_ === undefined) {
      this.base_ = new Character(this.agent.agent, this.id_);
    }
    return this.base_;
  }

  /**
   * @returns The character details of the specific member
   */
  details() {
    return this.base.details();
  }

  /**
   * @returns The character portraits of the specific member
   */
  portraits() {
    return this.base.portraits();
  }

  /**
   * @returns The member's corporation history
   */
  history() {
    return this.base.history();
  }

  /**
   * @returns The member's affiliation information
   */
  affiliations() {
    return this.base.affiliations();
  }

  /**
   * @returns The member's character name
   */
  names() {
    return this.base.names();
  }

  /**
   * @esi_route ~get_corporations_corporation_id_membertracking
   *
   * @returns Online and login status for the specific member
   */
  tracking() {
    return getTracking(this.agent)
    .then(all => r.impl.filterArray(all, this.id_, e => e.character_id));
  }

  /**
   * @esi_route ~get_corporations_corporation_id_roles
   *
   * @returns The roles of the member
   */
  roles() {
    return getRoles(this.agent)
    .then(all => r.impl.filterArray(all, this.id_, e => e.character_id));
  }

  /**
   * @esi_route ~get_corporations_corporation_id_members_titles
   *
   * @returns The title ids that are assigned to the member
   */
  titles() {
    return getTitles(this.agent)
    .then(all => r.impl.filterArray(all, this.id_, e => e.character_id).titles);
  }
}

/**
 * An api adapter for accessing various details of multiple member ids,
 * specified by a provided an array or set of ids when the api is instantiated.
 */
export class MappedMembers extends r.impl.SimpleMappedResource implements r.Mapped<MemberAPI> {
  private base_?: MappedCharacters;

  constructor(private agent: SSOAgent<number | r.impl.IDProvider>,
      ids: number[] | Set<number>) {
    super(ids);
  }

  private get base(): MappedCharacters {
    if (this.base_ === undefined) {
      this.base_ = new MappedCharacters(this.agent.agent, this.ids_);
    }
    return this.base_;
  }

  /**
   * @returns The character details of the members, mapped by id
   */
  details() {
    return this.base.details();
  }

  /**
   * @returns The character portraits of the members, mapped by id
   */
  portraits() {
    return this.base.portraits();
  }

  /**
   * @returns The members' corporation histories, mapped by id
   */
  history() {
    return this.base.history();
  }

  /**
   * @returns The members' affiliations information, mapped by id
   */
  affiliations() {
    return this.base.affiliations();
  }

  /**
   * @returns The members' character names, mapped by id
   */
  names() {
    return this.base.names();
  }

  /**
   * @esi_route ~get_corporations_corporation_id_membertracking
   *
   * @returns Online and login status for the members, mapped by id
   */
  tracking() {
    return this.arrayIDs().then(ids => getTracking(this.agent)
    .then(all => r.impl.filterArrayToMap(all, ids, e => e.character_id)));
  }

  /**
   * @esi_route ~get_corporations_corporation_id_roles
   *
   * @returns The roles of the members, mapped by id
   */
  roles() {
    return this.arrayIDs().then(ids => getRoles(this.agent)
    .then(all => r.impl.filterArrayToMap(all, ids, e => e.character_id)));
  }

  /**
   * @esi_route ~get_corporations_corporation_id_members_titles
   *
   * @returns The title ids that are assigned to each member, mapped by id
   */
  titles() {
    return this.arrayIDs().then(ids => getTitles(this.agent)
    .then(all => r.impl.filterArrayToMap(all, ids, e => e.character_id))
    .then(map => {
      let remap = new Map();
      for (let [k, v] of map.entries()) {
        remap.set(k, v.titles);
      }
      return remap;
    }));
  }
}

/**
 * An api adapter for accessing various details about every member of the
 * corporation.
 */
export class IteratedMembers extends r.impl.SimpleIteratedResource<number> implements r.Iterated<MemberAPI> {
  constructor(private agent: SSOAgent<number | r.impl.IDProvider>) {
    super(r.impl.makeArrayStreamer(() => getMembersAsArray(agent)), e => e);
  }

  /**
   * @returns An iterator over the character details of the members
   */
  details() {
    return this.getResource(
        id => this.agent.agent.request('get_characters_character_id',
            { path: { character_id: id } }));
  }

  /**
   * @returns An iterator over the character portraits of the members
   */
  portraits() {
    return this.getResource(
        id => this.agent.agent.request('get_characters_character_id_portrait',
            { path: { character_id: id } }));
  }

  /**
   * @returns An iterator over the members' corporation histories
   */
  history() {
    return this.getResource(id => this.agent.agent.request(
        'get_characters_character_id_corporationhistory',
        { path: { character_id: id } }));
  }

  /**
   * @esi_route post_characters_affiliation
   *
   * @returns An iterator over the members' affiliations information
   */
  affiliations() {
    return getIteratedValues(this.ids(),
        idSet => this.agent.agent.request('post_characters_affiliation',
            { body: idSet }), e => [e.character_id, e], 1000);
  }

  /**
   * @esi_route post_universe_names [character]
   *
   * @returns An iterator over the members' character names
   */
  names() {
    return getIteratedNames(this.agent.agent,
        esi.universe.NameCategory.CHARACTER, this.ids());
  }

  /**
   * @esi_route get_corporations_corporation_id_roles
   *
   * @returns An iterator over the roles of each member
   */
  async * roles() {
    let roles = await getRoles(this.agent);
    for (let r of roles) {
      yield <[number, esi.corporation.MemberRoles]> [r.character_id, r];
    }
  }

  /**
   * @esi_route get_corporations_corporation_id_members_titles
   *
   * @returns An iterator over the title ids assigned to each member
   */
  async * titles() {
    let titles = await getTitles(this.agent);
    for (let t of titles) {
      yield <[number, number[]]> [t.character_id, t.titles];
    }
  }

  /**
   * @esi_route get_corporations_corporation_id_membertracking
   *
   * @returns An iterator over the login status and tracking details of every
   *     member
   */
  async * tracking() {
    let tracking = await getTracking(this.agent);
    for (let t of tracking) {
      yield <[number, esi.corporation.MemberDetails]> [t.character_id, t];
    }
  }
}

/**
 * A functional interface for getting APIs for a specific member, a
 * known set of member ids, or every member for a corporation.
 */
export interface Members {
  /**
   * Create a new member api targeting every single member of the
   * corporation.
   *
   * @esi_route ids get_corporation_id_members
   *
   * @returns An IteratedMembers API wrapper
   */
  (): IteratedMembers;

  /**
   * Create a new member api targeting the particular member by `id`.
   *
   * @param id The member id
   * @returns A Member API wrapper for the given id
   */
  (id: number): Member;

  /**
   * Create a new member api targeting the multiple member ids. If an array is
   * provided, duplicates are removed (although the input array is not
   * modified).
   *
   * @param ids The member ids
   * @returns A MappedMembers API wrapper
   */
  (ids: number[] | Set<number>): MappedMembers;
}

/**
 * Create a new Members instance that uses the given `agent` to make its HTTP
 * requests to the ESI interface. The id of the `agent` refers to the
 * corporation id. The token of the `agent` must refer to a character that has
 * authorized the expected scopes and has the appropriate in-game roles for the
 * corporation.
 *
 * @param agent The agent making actual requests
 * @returns A Members instance
 */
export function makeMembers(agent: SSOAgent<number | r.impl.IDProvider>): Members {
  return <Members> function (ids: number | number[] | Set<number> | undefined) {
    if (ids === undefined) {
      // No ID so return an iterated variant
      return new IteratedMembers(agent);
    } else if (typeof ids === 'number') {
      // Single variant, with optional system ID
      return new Member(agent, ids);
    } else {
      // Multiple ids, so return a mapped variant
      return new MappedMembers(agent, ids);
    }
  };
}

async function getMembersAsArray(agent: SSOAgent<number | r.impl.IDProvider>) {
  let corpID: number;
  if (typeof agent.id === 'number') {
    corpID = agent.id;
  } else {
    corpID = await agent.id();
  }

  return agent.agent.request('get_corporations_corporation_id_members', {
    path: { corporation_id: corpID }
  }, agent.ssoToken).then(result => result.map(e => e.character_id));
}

async function getTitles(agent: SSOAgent<number | r.impl.IDProvider>) {
  let corpID: number;
  if (typeof agent.id === 'number') {
    corpID = agent.id;
  } else {
    corpID = await agent.id();
  }

  return agent.agent.request('get_corporations_corporation_id_members_titles', {
    path: { corporation_id: corpID }
  }, agent.ssoToken);
}

async function getRoles(agent: SSOAgent<number | r.impl.IDProvider>) {
  let corpID: number;
  if (typeof agent.id === 'number') {
    corpID = agent.id;
  } else {
    corpID = await agent.id();
  }

  return agent.agent.request('get_corporations_corporation_id_roles', {
    path: { corporation_id: corpID }
  }, agent.ssoToken);
}

async function getTracking(agent: SSOAgent<number | r.impl.IDProvider>) {
  let corpID: number;
  if (typeof agent.id === 'number') {
    corpID = agent.id;
  } else {
    corpID = await agent.id();
  }

  return agent.agent.request('get_corporations_corporation_id_membertracking', {
    path: { corporation_id: corpID }
  }, agent.ssoToken);
}
