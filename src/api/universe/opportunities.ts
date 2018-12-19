import { ESIAgent } from '../../internal/esi-agent';
import { Responses } from '../../../gen/esi';

/**
 * An api adapter that provides functions for accessing an opportunity group,
 * specified by id via functions in the
 * [opportunities](https://esi.evetech.net/latest/#/Opportunities) ESI
 * endpoints.
 */
export interface Group {
  /**
   * @esi_example esi.opportunities.groups(id).info()
   *
   * @returns Information about the opportunity group
   */
  info(): Promise<Responses['get_opportunities_groups_group_id']>;

  /**
   * @returns The group id
   */
  id(): Promise<number>;
}

/**
 * An api adapter over the end points handling multiple opportunity groups via
 * functions in the
 * [opportunities](https://esi.evetech.net/latest/#/Opportunities) ESI
 * endpoints.
 */
export interface Groups {
  /**
   * Create a new opportunity Group end point targeting the particular attribute
   * by `id`.
   *
   * @param id The group id
   * @returns A Group API wrapper
   */
  (id: number): Group;

  /**
   * @esi_example esi.opportunities.groups()
   *
   * @returns A list of all opportunity group IDs
   */
  (): Promise<Responses['get_opportunities_groups']>;
}

/**
 * An api adapter that provides functions for accessing a particular opportunity
 * task, specified by id via functions in the
 * [opportunity](https://esi.evetech.net/latest/#/Opportunities) ESI endpoints.
 */
export interface Task {
  /**
   * @esi_example esi.opportunities.tasks(id).info()
   *
   * @returns Information about the opportunity task
   */
  info(): Promise<Responses['get_opportunities_tasks_task_id']>;

  /**
   * @returns The task id
   */
  id(): Promise<number>;
}

/**
 * An api adapter over the end points handling multiple opportunity tasks via
 * functions in the
 * [opportunities](https://esi.evetech.net/latest/#/Opportunities) ESI
 * endpoints.
 */
export interface Tasks {
  /**
   * @esi_example esi.opportunities.tasks()
   *
   * @returns List of all opportunity task IDs
   */
  (): Promise<Responses['get_opportunities_tasks']>;

  /**
   * Create a new opportunity Task end point targeting the particular effect by
   * `id`.
   *
   * @param id The task id
   * @returns A Task API wrapper for the id
   */
  (id: number): Task;
}

/**
 * An api adapter over the end points handling opportunities information via
 * functions in the
 * [opportunities](https://esi.evetech.net/latest/#/Opportunities) ESI
 * endpoints.
 */
export interface Opportunities {
  /**
   * An instance of Groups for all opportunity groups in Eve.
   */
  groups: Groups;

  /**
   * An instance of Tasks for all opportunity tasks in Eve.
   */
  tasks: Tasks;
}

/**
 * Create a new {@link Opportunities} instance that uses the given `agent` to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns An Opportunities API instance
 */
export function makeOpportunities(agent: ESIAgent): Opportunities {
  let groups = <Groups> <any> function (id?: number) {
    if (id === undefined) {
      return agent.request('get_opportunities_groups', undefined);
    } else {
      return new GroupImpl(agent, id);
    }
  };

  let tasks = <Tasks> <any> function (id?: number) {
    if (id === undefined) {
      return agent.request('get_opportunities_tasks', undefined);
    } else {
      return new TaskImpl(agent, id);
    }
  };

  return { groups, tasks };
}

class GroupImpl implements Group {
  constructor(private agent: ESIAgent, private id_: number) {
  }

  info() {
    return this.agent.request('get_opportunities_groups_group_id',
        { path: { group_id: this.id_ } });
  }

  id() {
    return Promise.resolve(this.id_);
  }
}

class TaskImpl implements Task {
  constructor(private agent: ESIAgent, private id_: number) {
  }

  info() {
    return this.agent.request('get_opportunities_tasks_task_id',
        { path: { task_id: this.id_ } });
  }

  id() {
    return Promise.resolve(this.id_);
  }
}
