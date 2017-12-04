"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const r = require("../../internal/resource-api");
/**
 * An api adapter for accessing various details of a single in-game bloodline,
 * specified by a provided id when the api is instantiated.
 */
class Bloodline extends r.impl.SimpleResource {
    constructor(agent, id) {
        super(id);
        this.agent = agent;
    }
    /**
     * @esi_route ~get_universe_bloodlines
     *
     * @returns Information about the bloodline
     */
    details() {
        return getBloodlines(this.agent)
            .then(all => r.impl.filterArray(all, this.id_, r => r.bloodline_id));
    }
}
exports.Bloodline = Bloodline;
/**
 * An api adapter for accessing various details of multiple bloodline ids,
 * specified by a provided an array or set of ids when the api is instantiated.
 */
class MappedBloodlines extends r.impl.SimpleMappedResource {
    constructor(agent, ids) {
        super(ids);
        this.agent = agent;
    }
    /**
     * @esi_route ~get_universe_bloodlines
     *
     * @returns Bloodline details mapped by bloodline id
     */
    details() {
        return this.arrayIDs().then(ids => {
            return getBloodlines(this.agent)
                .then(all => r.impl.filterArrayToMap(all, ids, r => r.bloodline_id));
        });
    }
}
exports.MappedBloodlines = MappedBloodlines;
/**
 * An api adapter for accessing various details about every bloodline in the
 * game.
 */
class IteratedBloodlines extends r.impl.SimpleIteratedResource {
    constructor(agent) {
        super(r.impl.makeArrayStreamer(() => agent.request('get_universe_bloodlines', undefined)), r => r.bloodline_id);
        this.agent = agent;
    }
    /**
     * @esi_route get_universe_bloodlines
     *
     * @returns Iterator over details of all in-game types
     */
    details() {
        return this.getPaginatedResource();
    }
}
exports.IteratedBloodlines = IteratedBloodlines;
/**
 * Create a new Bloodlines instance that uses the given `agent` to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns A Bloodlines instance
 */
function makeBloodlines(agent) {
    return function (ids) {
        if (ids === undefined) {
            // All types since no id
            return new IteratedBloodlines(agent);
        }
        else if (typeof ids === 'number') {
            // Single id so single API
            return new Bloodline(agent, ids);
        }
        else {
            // Set or array, so mapped API
            return new MappedBloodlines(agent, ids);
        }
    };
}
exports.makeBloodlines = makeBloodlines;
function getBloodlines(agent) {
    return agent.request('get_universe_bloodlines', undefined);
}
//# sourceMappingURL=bloodlines.js.map