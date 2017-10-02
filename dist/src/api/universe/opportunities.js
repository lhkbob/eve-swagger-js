"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Create a new {@link Opportunities} instance that uses the given `agent` to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns An Opportunities API instance
 */
function makeOpportunities(agent) {
    let groups = function (id) {
        if (id === undefined) {
            return agent.request('get_opportunities_groups', undefined);
        }
        else {
            return new GroupImpl(agent, id);
        }
    };
    let tasks = function (id) {
        if (id === undefined) {
            return agent.request('get_opportunities_tasks', undefined);
        }
        else {
            return new TaskImpl(agent, id);
        }
    };
    return { groups, tasks };
}
exports.makeOpportunities = makeOpportunities;
class GroupImpl {
    constructor(agent, id_) {
        this.agent = agent;
        this.id_ = id_;
    }
    info() {
        return this.agent.request('get_opportunities_groups_group_id', { path: { group_id: this.id_ } });
    }
    id() {
        return Promise.resolve(this.id_);
    }
}
class TaskImpl {
    constructor(agent, id_) {
        this.agent = agent;
        this.id_ = id_;
    }
    info() {
        return this.agent.request('get_opportunities_tasks_task_id', { path: { task_id: this.id_ } });
    }
    id() {
        return Promise.resolve(this.id_);
    }
}
//# sourceMappingURL=opportunities.js.map