"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const r = require("../../internal/resource-api");
const types_1 = require("./types");
/**
 * An api adapter for accessing various details of a single in-game group,
 * specified by a provided id when the api is instantiated.
 */
class Group extends r.impl.SimpleResource {
    constructor(agent, id) {
        super(id);
        this.agent = agent;
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
    get members() {
        if (this.members_ === undefined) {
            this.members_ = new types_1.MappedTypes(this.agent, () => this.details().then(result => result.types));
        }
        return this.members_;
    }
}
exports.Group = Group;
/**
 * An api adapter for accessing various details of multiple group ids,
 * specified by a provided an array or set of ids when the api is instantiated.
 */
class MappedGroups extends r.impl.SimpleMappedResource {
    constructor(agent, ids) {
        super(ids);
        this.agent = agent;
    }
    /**
     * @returns Group details mapped by group id
     */
    details() {
        return this.getResource(id => getDetails(this.agent, id));
    }
}
exports.MappedGroups = MappedGroups;
/**
 * An api adapter for accessing various details about every group in the game.
 * Even though a route exists to get all group ids at once, due to their
 * quantity, the API provides asynchronous iterators for the rest of their
 * details.
 */
class IteratedGroups extends r.impl.SimpleIteratedResource {
    constructor(agent) {
        super(r.impl.makePageBasedStreamer(page => agent.request('get_universe_groups', { query: { page: page } })
            .then(result => ({ result, maxPages: undefined })), 1000), id => id);
        this.agent = agent;
    }
    /**
     * @returns Iterator over details of all in-game groups
     */
    details() {
        return this.getResource(id => getDetails(this.agent, id));
    }
}
exports.IteratedGroups = IteratedGroups;
/**
 * Create a new Groups instance that uses the given `agent` to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns A Groups instance
 */
function makeGroups(agent) {
    return function (ids) {
        if (ids === undefined) {
            // All groups since no id
            return new IteratedGroups(agent);
        }
        else if (typeof ids === 'number') {
            // Single id so single API
            return new Group(agent, ids);
        }
        else {
            // Set or array, so mapped API
            return new MappedGroups(agent, ids);
        }
    };
}
exports.makeGroups = makeGroups;
function getDetails(agent, id) {
    return agent.request('get_universe_groups_group_id', { path: { group_id: id } });
}
//# sourceMappingURL=groups.js.map