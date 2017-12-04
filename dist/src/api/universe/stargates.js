"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const r = require("../../internal/resource-api");
/**
 * An api adapter for accessing various details of a single stargate,
 * specified by a provided id when the api is instantiated.
 */
class Stargate {
    constructor(agent, id) {
        this.agent = agent;
        this.id = id;
    }
    /**
     * @returns Information about the stargate
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
exports.Stargate = Stargate;
/**
 * An api adapter for accessing various details of multiple stargate ids,
 * specified by a provided an array or set of ids when the api is instantiated.
 */
class MappedStargates extends r.impl.SimpleMappedResource {
    constructor(agent, ids) {
        super(ids);
        this.agent = agent;
    }
    /**
     * @returns Stargate details mapped by stargate id
     */
    details() {
        return this.getResource(id => getDetails(this.agent, id));
    }
}
exports.MappedStargates = MappedStargates;
/**
 * Create a new Stargates instance that uses the given `agent` to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns A Stargates instance
 */
function makeStargates(agent) {
    return function (ids) {
        if (typeof ids === 'number') {
            // Single id so single API
            return new Stargate(agent, ids);
        }
        else {
            // Set or array, so mapped API
            return new MappedStargates(agent, ids);
        }
    };
}
exports.makeStargates = makeStargates;
function getDetails(agent, id) {
    return agent.request('get_universe_stargates_stargate_id', { path: { stargate_id: id } });
}
//# sourceMappingURL=stargates.js.map