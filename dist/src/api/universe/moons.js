"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const r = require("../../internal/resource-api");
/**
 * An api adapter for accessing various details of a single moon,
 * specified by a provided id when the api is instantiated.
 */
class Moon extends r.impl.SimpleResource {
    constructor(agent, id) {
        super(id);
        this.agent = agent;
    }
    /**
     * @returns Information about the moon
     */
    details() {
        return getDetails(this.agent, this.id_);
    }
}
exports.Moon = Moon;
/**
 * An api adapter for accessing various details of multiple moon ids,
 * specified by a provided an array or set of ids when the api is instantiated.
 */
class MappedMoons extends r.impl.SimpleMappedResource {
    constructor(agent, ids) {
        super(ids);
        this.agent = agent;
    }
    /**
     * @returns Moon details mapped by moon id
     */
    details() {
        return this.getResource(id => getDetails(this.agent, id));
    }
}
exports.MappedMoons = MappedMoons;
/**
 * Create a new Moons instance that uses the given `agent` to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns A Moons instance
 */
function makeMoons(agent) {
    return function (ids) {
        if (typeof ids === 'number') {
            // Single id so single API
            return new Moon(agent, ids);
        }
        else {
            // Set or array, so mapped API
            return new MappedMoons(agent, ids);
        }
    };
}
exports.makeMoons = makeMoons;
function getDetails(agent, id) {
    return agent.request('get_universe_moons_moon_id', { path: { moon_id: id } });
}
//# sourceMappingURL=moons.js.map