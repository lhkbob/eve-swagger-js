const CallableInstance = require('../../internal/callable-instance');

/**
 * An api adapter that provides functions for accessing a opportunity group,
 * specified by id via functions in the
 * [opportunities](https://esi.tech.ccp.is/latest/#/Opportunities) ESI
 * endpoints.
 *
 * You should not usually instantiate this directly as its constructor requires
 * an internal api instance.
 */
class OpportunityGroup {
  /**
   * Create a new OpportunityGroup identified as `groupId`.
   *
   * @param agent {ESIAgent} The ESI agent used to make web requests
   * @param groupId {Number} The group id used in all requests
   * @constructor
   */
  constructor(agent, groupId) {
    this._agent = agent;
    this._id = groupId;
  }

  /**
   * @esi_route get_opportunities_groups_group_id
   * @esi_example esi.opportunities.groups(1).info()
   *
   * @returns {Promise.<Object>}
   */
  info() {
    return this._agent.noAuth.get('/v1/opportunities/groups/{group_id}/',
        { path: { 'group_id': this._id } });
  }
}

/**
 * An api adapter over the end points handling multiple opportunity groups via
 * functions in the
 * [opportunities](https://esi.tech.ccp.is/latest/#/Opportunities) ESI
 * endpoints. You should not usually instantiate this directly as its
 * constructor requires an internal api instance.
 *
 * This is a function class so instances of `OpportunityGroups` are functions
 * and can be invoked directly, besides accessing its members. Its default
 * function action is equivalent to {@link OpportunityGroups#get get} or {@link
 * OpportunityGroups#all all} depending on if an id is provided.
 */
class OpportunityGroups extends CallableInstance {
  /**
   * Create a new Alliances function using the given `agent`.
   *
   * @param agent {ESIAgent} The ESI agent
   * @constructor
   */
  constructor(agent) {
    super(id => id ? this.get(id) : this.all());
    this._agent = agent;
  }

  /**
   * Create a new OpportunityGroup end point targeting the particular attribute
   * by `id`.
   *
   * @param id {Number} The group id
   * @returns {OpportunityGroup}
   */
  get(id) {
    return new OpportunityGroup(this._agent, id);
  }

  /**
   * @esi_route get_opportunities_groups
   * @esi_example esi.opportunities.groups()
   *
   * @returns {Promise.<Array.<Number>>}
   */
  all() {
    return this._agent.noAuth.get('/v1/opportunities/groups/');
  }
}

/**
 * An api adapter that provides functions for accessing a particular opportunity
 * task, specified by id via functions in the
 * [opportunity](https://esi.tech.ccp.is/latest/#/Opportunities) ESI endpoints.
 *
 * You should not usually instantiate this directly as its constructor requires
 * an internal api instance.
 */
class OpportunityTask {
  /**
   * Create a new OpportunityTask identified as `taskId`.
   *
   * @param agent {ESIAgent} The ESI agent used to make web requests
   * @param taskId {Number} The task id used in all requests
   * @constructor
   */
  constructor(agent, taskId) {
    this._agent = agent;
    this._id = taskId;
  }

  /**
   * @esi_route get_opportunities_tasks_task_id
   * @esi_example esi.opportunities.tasks(1).info()
   *
   * @returns {Promise.<Object>}
   */
  info() {
    return this._agent.noAuth.get('/v1/opportunities/tasks/{task_id}/',
        { path: { 'task_id': this._id } });
  }
}

/**
 * An api adapter over the end points handling multiple opportunity tasks via
 * functions in the [opportunities](https://esi.tech.ccp.is/latest/#/Opportunities)
 * ESI endpoints. You should not usually instantiate this directly as its
 * constructor requires an internal api instance.
 *
 * This is a function class so instances of `OpportunityTasks` are functions and can
 * be invoked directly, besides accessing its members. Its default function
 * action is equivalent to {@link OpportunityTasks#get get} or {@link OpportunityTasks#all
 * all} depending on if an id is provided.
 */
class OpportunityTasks extends CallableInstance {
  /**
   * Create a new OpportunityTasks function using the given `agent`.
   *
   * @param agent {ESIAgent} The ESI agent
   * @constructor
   */
  constructor(agent) {
    super(id => id ? this.get(id) : this.all());
    this._agent = agent;
  }

  /**
   * Create a new OpportunityTask end point targeting the particular effect by `id`.
   *
   * @param id {Number} The effect id
   * @returns {OpportunityTask}
   */
  get(id) {
    return new OpportunityTask(this._agent, id);
  }

  /**
   * @esi_route get_opportunities_tasks
   * @esi_example esi.opportunities.tasks()
   *
   * @returns {Promise.<Array.<Number>>}
   */
  all() {
    return this._agent.noAuth.get('/v1/opportunities/tasks/');
  }
}

/**
 * An api adapter over the end points handling opportunities information via
 * functions in the
 * [opportunities](https://esi.tech.ccp.is/latest/#/Opportunities) ESI
 * endpoints. You should not usually instantiate this directly as its
 * constructor requires an internal api instance.
 */
class Opportunities {
  /**
   * Create a new Opportunities end point using the given `agent`.
   *
   * @param agent {ESIAgent} The ESI agent
   * @constructor
   */
  constructor(agent) {
    this._agent = agent;
    this._groups = null;
    this._tasks = null;
  }

  /**
   * An instance of OpportunityGroups for all opportunity groups in Eve.
   *
   * @type {OpportunityGroups}
   */
  get groups() {
    if (!this._groups) {
      this._groups = new OpportunityGroups(this._agent);
    }
    return this._groups;
  }

  /**
   * An instance of OpportunityTasks for all opportunity tasks in Eve.
   *
   * @type {OpportunityTasks}
   */
  get tasks() {
    if (!this._tasks) {
      this._tasks = new OpportunityTasks(this._agent);
    }
    return this._tasks;
  }
}

module.exports = Opportunities;
