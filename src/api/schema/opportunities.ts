import { ESIAgent } from '../../internal/esi-agent';
import { Responses, esi } from '../../esi';

import * as r from '../../internal/resource-api';

/**
 * The API specification for all variants that access information about an
 * opportunity group or multiple groups. This interface will not be used
 * directly, but will be filtered through some mapper, such as {@link Async} or
 * {@link Mapped} depending on what types of ids are being accessed. However,
 * this allows for a concise and consistent specification for all variants:
 * single, multiple, and all groups.
 *
 * When mapped, each key defined in this interface becomes a function that
 * returns a Promise resolving to the key's type, or a collection related to
 * the key's type if multiple groups are being accessed at once.
 *
 * This is an API wrapper over the end points handling opportunity groups in the
 * [opportunities](https://esi.tech.ccp.is/latest/#/Opportunities) ESI
 * endpoints.
 */
export interface OpportunityGroupAPI {
  details: Responses['get_opportunities_groups_group_id'];
}

/**
 * An api adapter for accessing various details of a single opportunity group,
 * specified by a provided id when the api is instantiated.
 */
export class OpportunityGroup extends r.impl.SimpleResource implements r.Async<OpportunityGroupAPI> {
  private connected_: MappedOpportunityGroups | undefined;
  private tasks_: MappedOpportunityTasks | undefined;

  constructor(private agent: ESIAgent, id: number) {
    super(id);
  }

  /**
   * @returns Information about the opportunity group
   */
  details() {
    return getGroup(this.agent, this.id_);
  }

  /**
   * @esi_route ~get_opportunities_groups_group_id
   *
   * @returns A MappedOpportunityGroups instance that is tied to the connected
   *    group ids referenced in the details of this group
   */
  connected(): MappedOpportunityGroups {
    if (this.connected_ === undefined) {
      this.connected_ = new MappedOpportunityGroups(this.agent,
          () => this.details().then(result => result.connected_groups));
    }
    return this.connected_!;
  }

  /**
   * @esi_route ~get_opportunities_groups_group_id
   *
   * @returns A MappedOpportunityTasks instance that is tied to the required
   *    tasks referenced in the details of this group
   */
  tasks(): MappedOpportunityTasks {
    if (this.tasks_ === undefined) {
      this.tasks_ = new MappedOpportunityTasks(this.agent,
          () => this.details().then(result => result.required_tasks));
    }
    return this.tasks_!;
  }
}

/**
 * An api adapter for accessing various details of multiple opportunity groups,
 * specified by a provided an array or set of ids when the api is instantiated.
 */
export class MappedOpportunityGroups extends r.impl.SimpleMappedResource implements r.Mapped<OpportunityGroupAPI> {
  constructor(private agent: ESIAgent,
      ids: number[] | Set<number> | r.impl.IDSetProvider) {
    super(ids);
  }

  /**
   * @returns Group details mapped by group id
   */
  details() {
    return this.getResource(id => getGroup(this.agent, id));
  }
}

/**
 * An api adapter for accessing various details about every opportunity group in
 * the game. Even though a route exists to get all group ids at once, due to
 * their quantity, the API provides asynchronous iterators for the rest of their
 * details.
 */
export class AllOpportunityGroups extends r.impl.ArrayIteratedResource implements r.Iterated<OpportunityGroupAPI> {
  constructor(private agent: ESIAgent) {
    super(() => agent.request('get_opportunities_groups', undefined));
  }

  /**
   * @returns Iterator over details of all opportunity groups
   */
  details() {
    return this.getResource(id => getGroup(this.agent, id));
  }
}

/**
 * A functional interface for getting APIs for a specific opportunity group, a
 * known set of group ids, or every opportunity group in the game.
 */
export interface OpportunityGroupAPIFactory {
  /**
   * Create a new opportunity group api targeting every single group in the
   * game.
   *
   * @esi_route ids get_opportunities_groups
   *
   * @returns An AllOpportunityGroups API wrapper
   */
  (): AllOpportunityGroups;

  /**
   * Create a new opportunity group api targeting the particular group by `id`.
   *
   * @param id The group id
   * @returns An OpportunityGroup API wrapper for the given id
   */
  (id: number): OpportunityGroup;

  /**
   * Create a new opportunity group api targeting the multiple group ids. If an
   * array is provided, duplicates are removed (although the input array is not
   * modified).
   *
   * @param ids The group ids
   * @returns A MappedOpportunityGroups API wrapper for the given ids
   */
  (ids: number[] | Set<number>): MappedOpportunityGroups;
}

/**
 * The API specification for all variants that access information about an
 * opportunity task or multiple tasks. This interface will not be used directly,
 * but will be filtered through some mapper, such as {@link Async} or {@link
    * Mapped} depending on what types of ids are being accessed. However, this
 * allows for a concise and consistent specification for all variants: single,
 * multiple, and all tasks.
 *
 * When mapped, each key defined in this interface becomes a function that
 * returns a Promise resolving to the key's type, or a collection related to
 * the key's type if multiple tasks are being accessed at once.
 *
 * This is an API wrapper over the end points handling opportunity tasks in the
 * [opportunities](https://esi.tech.ccp.is/latest/#/Opportunities) ESI
 * endpoints.
 */
export interface OpportunityTaskAPI {
  details: Responses['get_opportunities_tasks_task_id'];
}

/**
 * An api adapter for accessing various details of a single opportunity group,
 * specified by a provided id when the api is instantiated.
 */
export class OpportunityTask extends r.impl.SimpleResource implements r.Async<OpportunityTaskAPI> {
  constructor(private agent: ESIAgent, id: number) {
    super(id);
  }

  /**
   * @returns Information about the opportunity task
   */
  details() {
    return getTask(this.agent, this.id_);
  }
}

/**
 * An api adapter for accessing various details of multiple opportunity tasks,
 * specified by a provided an array or set of ids when the api is instantiated.
 */
export class MappedOpportunityTasks extends r.impl.SimpleMappedResource implements r.Mapped<OpportunityTaskAPI> {
  constructor(private agent: ESIAgent,
      ids: number[] | Set<number> | r.impl.IDSetProvider) {
    super(ids);
  }

  /**
   * @returns Task details mapped by task id
   */
  details() {
    return this.getResource(id => getTask(this.agent, id));
  }
}

/**
 * An api adapter for accessing various details about every opportunity task in
 * the game. Even though a route exists to get all task ids at once, due to
 * their quantity, the API provides asynchronous iterators for the rest of their
 * details.
 */
export class AllOpportunityTasks extends r.impl.ArrayIteratedResource implements r.Iterated<OpportunityTaskAPI> {
  constructor(private agent: ESIAgent) {
    super(() => agent.request('get_opportunities_tasks', undefined));
  }

  /**
   * @returns Iterator over details of all opportunity tasks
   */
  details() {
    return this.getResource(id => getTask(this.agent, id));
  }
}

/**
 * A functional interface for getting APIs for a specific opportunity task, a
 * known set of task ids, or every opportunity task in the game.
 */
export interface OpportunityTaskAPIFactory {
  /**
   * Create a new opportunity group api targeting every single task in the
   * game.
   *
   * @esi_route ids get_opportunities_tasks
   *
   * @returns An AllOpportunityTasks API wrapper
   */
  (): AllOpportunityTasks;

  /**
   * Create a new opportunity group api targeting the particular task by `id`.
   *
   * @param id The task id
   * @returns An OpportunityTask API wrapper for the given id
   */
  (id: number): OpportunityTask;

  /**
   * Create a new opportunity task api targeting the multiple task ids. If an
   * array is provided, duplicates are removed (although the input array is not
   * modified).
   *
   * @param ids The task ids
   * @returns A MappedOpportunityTasks API wrapper for the given ids
   */
  (ids: number[] | Set<number>): MappedOpportunityTasks;
}

/**
 * A simple wrapper around functional interfaces for getting APIs for
 * opportunity groups and tasks, both of which utilize the
 * [opportunities](https://esi.tech.ccp.is/latest/#/Opportunities) ESI end
 * points.
 */
export interface OpportunitiesAPIFactory {
  readonly groups: OpportunityGroupAPIFactory;
  readonly tasks: OpportunityTaskAPIFactory;
}

/**
 * Create a new OpportunitiesFactory instance that uses the given `agent` to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns An OpportunitiesFactory API instance
 */
export function makeOpportunitiesAPIFactory(agent: ESIAgent): OpportunitiesAPIFactory {
  let groups = <OpportunityGroupAPIFactory> function (ids: number | number[] | Set<number> | undefined) {
    if (ids === undefined) {
      // No ids so all groups
      return new AllOpportunityGroups(agent);
    } else if (typeof ids === 'number') {
      // Single id for a group
      return new OpportunityGroup(agent, ids);
    } else {
      // Mapped groups
      return new MappedOpportunityGroups(agent, ids);
    }
  };

  let tasks = <OpportunityTaskAPIFactory> function (ids: number | number[] | Set<number> | undefined) {
    if (ids === undefined) {
      // No ids so all tasks
      return new AllOpportunityTasks(agent);
    } else if (typeof ids === 'number') {
      // Single id for a task
      return new OpportunityTask(agent, ids);
    } else {
      // Mapped tasks
      return new MappedOpportunityTasks(agent, ids);
    }
  };

  return { groups, tasks };
}

function getGroup(agent: ESIAgent, id: number) {
  return agent.request('get_opportunities_groups_group_id',
      { path: { group_id: id } });
}

function getTask(agent: ESIAgent, id: number) {
  return agent.request('get_opportunities_tasks_task_id',
      { path: { task_id: id } });
}