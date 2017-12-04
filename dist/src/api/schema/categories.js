"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const r = require("../../internal/resource-api");
const groups_1 = require("./groups");
/**
 * An api adapter for accessing various details of a single in-game category,
 * specified by a provided id when the api is instantiated.
 */
class Category extends r.impl.SimpleResource {
    constructor(agent, id) {
        super(id);
        this.agent = agent;
    }
    /**
     * @returns Information about the category
     */
    details() {
        return getDetails(this.agent, this.id_);
    }
    /**
     * @returns A MappedGroups instance tied to the groups defined in the details
     *    of this category
     */
    get members() {
        if (this.members_ === undefined) {
            this.members_ = new groups_1.MappedGroups(this.agent, () => this.details().then(result => result.groups));
        }
        return this.members_;
    }
}
exports.Category = Category;
/**
 * An api adapter for accessing various details of multiple category ids,
 * specified by a provided an array or set of ids when the api is instantiated.
 */
class MappedCategories extends r.impl.SimpleMappedResource {
    constructor(agent, ids) {
        super(ids);
        this.agent = agent;
    }
    /**
     * @returns Category details mapped by category id
     */
    details() {
        return this.getResource(id => getDetails(this.agent, id));
    }
}
exports.MappedCategories = MappedCategories;
/**
 * An api adapter for accessing various details about every category in the
 * game. Even though a route exists to get all category ids at once, due to
 * their quantity, the API provides asynchronous iterators for the rest of their
 * details.
 */
class IteratedCategories extends r.impl.SimpleIteratedResource {
    constructor(agent) {
        super(r.impl.makeArrayStreamer(() => agent.request('get_universe_categories', undefined)), id => id);
        this.agent = agent;
    }
    /**
     * @returns Iterator over details of all in-game categories
     */
    details() {
        return this.getResource(id => getDetails(this.agent, id));
    }
}
exports.IteratedCategories = IteratedCategories;
/**
 * Create a new Categories instance that uses the given `agent` to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns A Categories instance
 */
function makeCategories(agent) {
    return function (ids) {
        if (ids === undefined) {
            // All categories since no id
            return new IteratedCategories(agent);
        }
        else if (typeof ids === 'number') {
            // Single id so single API
            return new Category(agent, ids);
        }
        else {
            // Set or array, so mapped API
            return new MappedCategories(agent, ids);
        }
    };
}
exports.makeCategories = makeCategories;
function getDetails(agent, id) {
    return agent.request('get_universe_categories_category_id', { path: { category_id: id } });
}
//# sourceMappingURL=categories.js.map