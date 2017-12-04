"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const r = require("../../internal/resource-api");
/**
 * An api adapter for accessing various details of a single PI star,
 * specified by a provided id when the api is instantiated.
 */
class Star {
    constructor(agent, id) {
        this.agent = agent;
        this.id = id;
    }
    /**
     * @returns Information about the star
     */
    details() {
        return this.ids().then(id => getDetails(this.agent, id));
    }
    ids() {
        if (typeof this.id === 'number') {
            return Promise.resolve(this.id);
        }
        else {
            return this.id();
        }
    }
}
exports.Star = Star;
/**
 * An api adapter for accessing various details of multiple star ids,
 * specified by a provided an array or set of ids when the api is instantiated.
 */
class MappedStars extends r.impl.SimpleMappedResource {
    constructor(agent, ids) {
        super(ids);
        this.agent = agent;
    }
    /**
     * @returns Star details mapped by star id
     */
    details() {
        return this.getResource(id => getDetails(this.agent, id));
    }
}
exports.MappedStars = MappedStars;
/**
 * Create a new Stars instance that uses the given `agent` to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns A Stars instance
 */
function makeStars(agent) {
    return function (ids) {
        if (typeof ids === 'number') {
            // Single id so single API
            return new Star(agent, ids);
        }
        else {
            // Set or array, so mapped API
            return new MappedStars(agent, ids);
        }
    };
}
exports.makeStars = makeStars;
function getDetails(agent, id) {
    return agent.request('get_universe_stars_star_id', { path: { star_id: id } });
}
//# sourceMappingURL=stars.js.map