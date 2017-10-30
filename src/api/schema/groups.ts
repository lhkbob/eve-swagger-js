import { ESIAgent } from '../../internal/esi-agent';
import { Responses, esi } from '../../esi';

import * as r from '../../internal/resource-api';
import { MappedTypes } from './types';

/**
 * The API specification for all variants that access information about an
 * in-game group or multiple groups. This interface will not be used directly,
 * but will be filtered through some mapper, such as {@link Async} or {@link
 * Mapped} depending on what types of ids are being accessed. However, this
 * allows for a concise and consistent specification for all variants: single,
 * multiple, and all groups.
 *
 * When mapped, each key defined in this interface becomes a function that
 * returns a Promise resolving to the key's type, or a collection related to the
 * key's type if multiple groups are being accessed at once.
 *
 * This is an API wrapper over the end points handling groups in the
 * [universe](https://esi.tech.ccp.is/latest/#/Universe) ESI endpoints.
 */
export interface GroupAPI {
  details: Responses['get_universe_groups_group_id'];
}

/**
 * An api adapter for accessing various details of a single in-game group,
 * specified by a provided id when the api is instantiated.
 */
export class Group extends r.impl.SimpleResource implements r.Async<GroupAPI> {
  private members_: MappedTypes | undefined;

  constructor(private agent: ESIAgent, id: number) {
    super(id);
  }

  /**
   * @returns Information about the group
   */
  details() {
    return getDetails(this.agent, this.id_);
  }

  /**
   * @returns A MappedTypes instance tied to the types defined in the details of
   *    this group
   */
  get members(): MappedTypes {
    if (this.members_ === undefined) {
      this.members_ = new MappedTypes(this.agent,
          () => this.details().then(result => result.types));
    }
    return this.members_!;
  }
}

/**
 * An api adapter for accessing various details of multiple group ids,
 * specified by a provided an array or set of ids when the api is instantiated.
 */
export class MappedGroups extends r.impl.SimpleMappedResource implements r.Mapped<GroupAPI> {
  constructor(private agent: ESIAgent, ids: number[] | Set<number> | r.impl.IDSetProvider) {
    super(ids);
  }

  /**
   * @returns Group details mapped by group id
   */
  details() {
    return this.getResource(id => getDetails(this.agent, id));
  }
}

/**
 * An api adapter for accessing various details about every group in the game.
 */
export class AllGroups extends r.impl.SimpleIteratedResource<number> implements r.Iterated<GroupAPI> {
  constructor(private agent: ESIAgent) {
    super(r.impl.makePageBasedStreamer(
        page => agent.request('get_universe_groups', { query: { page: page } })
        .then(result => <[number[], number | undefined]> [result, undefined]),
        1000), id => id);
  }

  /**
   * @returns Iterator over details of all in-game groups
   */
  details() {
    return this.getResource(id => getDetails(this.agent, id));
  }
}

/**
 * A functional interface for getting APIs for a specific group, a
 * known set of group ids, or every group in the game.
 */
export interface GroupAPIFactory {
  /**
   * Create a new group api targeting every single group in the game.
   *
   * @esi_route ids get_universe_groups
   *
   * @returns An AllGroups API wrapper
   */
  (): AllGroups;

  /**
   * Create a new group api targeting the particular group by `id`.
   *
   * @param id The group id
   * @returns An Group API wrapper for the given id
   */
  (id: number): Group;

  /**
   * Create a new group api targeting the multiple group ids. If an
   * array is provided, duplicates are removed (although the input array is not
   * modified).
   *
   * @param ids The group ids
   * @returns A MappedGroups API wrapper for the given ids
   */
  (ids: number[] | Set<number>): MappedGroups;
}

/**
 * Create a new GroupAPIFactory instance that uses the given `agent` to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns A GroupAPIFactory instance
 */
export function makeGroupAPIFactory(agent: ESIAgent): GroupAPIFactory {
  return <GroupAPIFactory> function (ids: number | number[] | Set<number> | undefined) {
    if (ids === undefined) {
      // All groups since no id
      return new AllGroups(agent);
    } else if (typeof ids === 'number') {
      // Single id so single API
      return new Group(agent, ids);
    } else {
      // Set or array, so mapped API
      return new MappedGroups(agent, ids);
    }
  };
}

function getDetails(agent: ESIAgent, id: number) {
  return agent.request('get_universe_groups_group_id',
      { path: { group_id: id } });
}
