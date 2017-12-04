"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const r = require("../../internal/resource-api");
/**
 * An api adapter for accessing various details of a single opportunity group,
 * specified by a provided id when the api is instantiated.
 */
class OpportunityGroup extends r.impl.SimpleResource {
    constructor(agent, id) {
        super(id);
        this.agent = agent;
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
    connected() {
        if (this.connected_ === undefined) {
            this.connected_ = new MappedOpportunityGroups(this.agent, () => this.details().then(result => result.connected_groups));
        }
        return this.connected_;
    }
    /**
     * @esi_route ~get_opportunities_groups_group_id
     *
     * @returns A MappedOpportunityTasks instance that is tied to the required
     *    tasks referenced in the details of this group
     */
    tasks() {
        if (this.tasks_ === undefined) {
            this.tasks_ = new MappedOpportunityTasks(this.agent, () => this.details().then(result => result.required_tasks));
        }
        return this.tasks_;
    }
}
exports.OpportunityGroup = OpportunityGroup;
/**
 * An api adapter for accessing various details of multiple opportunity groups,
 * specified by a provided an array or set of ids when the api is instantiated.
 */
class MappedOpportunityGroups extends r.impl.SimpleMappedResource {
    constructor(agent, ids) {
        super(ids);
        this.agent = agent;
    }
    /**
     * @returns Group details mapped by group id
     */
    details() {
        return this.getResource(id => getGroup(this.agent, id));
    }
}
exports.MappedOpportunityGroups = MappedOpportunityGroups;
/**
 * An api adapter for accessing various details about every opportunity group in
 * the game. Even though a route exists to get all group ids at once, due to
 * their quantity, the API provides asynchronous iterators for the rest of their
 * details.
 */
class IteratedOpportunityGroups extends r.impl.SimpleIteratedResource {
    constructor(agent) {
        super(r.impl.makeArrayStreamer(() => agent.request('get_opportunities_groups', undefined)), id => id);
        this.agent = agent;
    }
    /**
     * @returns Iterator over details of all opportunity groups
     */
    details() {
        return this.getResource(id => getGroup(this.agent, id));
    }
}
exports.IteratedOpportunityGroups = IteratedOpportunityGroups;
/**
 * An api adapter for accessing various details of a single opportunity group,
 * specified by a provided id when the api is instantiated.
 */
class OpportunityTask extends r.impl.SimpleResource {
    constructor(agent, id) {
        super(id);
        this.agent = agent;
    }
    /**
     * @returns Information about the opportunity task
     */
    details() {
        return getTask(this.agent, this.id_);
    }
}
exports.OpportunityTask = OpportunityTask;
/**
 * An api adapter for accessing various details of multiple opportunity tasks,
 * specified by a provided an array or set of ids when the api is instantiated.
 */
class MappedOpportunityTasks extends r.impl.SimpleMappedResource {
    constructor(agent, ids) {
        super(ids);
        this.agent = agent;
    }
    /**
     * @returns Task details mapped by task id
     */
    details() {
        return this.getResource(id => getTask(this.agent, id));
    }
}
exports.MappedOpportunityTasks = MappedOpportunityTasks;
/**
 * An api adapter for accessing various details about every opportunity task in
 * the game. Even though a route exists to get all task ids at once, due to
 * their quantity, the API provides asynchronous iterators for the rest of their
 * details.
 */
class IteratedOpportunityTasks extends r.impl.SimpleIteratedResource {
    constructor(agent) {
        super(r.impl.makeArrayStreamer(() => agent.request('get_opportunities_tasks', undefined)), id => id);
        this.agent = agent;
    }
    /**
     * @returns Iterator over details of all opportunity tasks
     */
    details() {
        return this.getResource(id => getTask(this.agent, id));
    }
}
exports.IteratedOpportunityTasks = IteratedOpportunityTasks;
/**
 * A simple wrapper around functional interfaces for getting APIs for
 * opportunity groups and tasks, both of which utilize the
 * [opportunities](https://esi.tech.ccp.is/latest/#/Opportunities) ESI end
 * points.
 */
class Opportunities {
    constructor(agent) {
        this.agent = agent;
    }
    get groups() {
        if (this.groups_ === undefined) {
            this.groups_ = getGroups.bind(this, this.agent);
        }
        return this.groups_;
    }
    get tasks() {
        if (this.tasks_ === undefined) {
            this.tasks_ = getTasks.bind(this, this.agent);
        }
        return this.tasks_;
    }
}
exports.Opportunities = Opportunities;
function getGroups(agent, ids) {
    if (ids === undefined) {
        // No ids so all groups
        return new IteratedOpportunityGroups(agent);
    }
    else if (typeof ids === 'number') {
        // Single id for a group
        return new OpportunityGroup(agent, ids);
    }
    else {
        // Mapped groups
        return new MappedOpportunityGroups(agent, ids);
    }
}
function getTasks(agent, ids) {
    if (ids === undefined) {
        // No ids so all tasks
        return new IteratedOpportunityTasks(agent);
    }
    else if (typeof ids === 'number') {
        // Single id for a task
        return new OpportunityTask(agent, ids);
    }
    else {
        // Mapped tasks
        return new MappedOpportunityTasks(agent, ids);
    }
}
function getGroup(agent, id) {
    return agent.request('get_opportunities_groups_group_id', { path: { group_id: id } });
}
function getTask(agent, id) {
    return agent.request('get_opportunities_tasks_task_id', { path: { task_id: id } });
}
//# sourceMappingURL=opportunities.js.map