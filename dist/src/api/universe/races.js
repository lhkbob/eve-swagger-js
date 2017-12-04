"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const r = require("../../internal/resource-api");
/**
 * An api adapter for accessing various details of a single in-game race,
 * specified by a provided id when the api is instantiated.
 */
class Race extends r.impl.SimpleResource {
    constructor(agent, id) {
        super(id);
        this.agent = agent;
    }
    /**
     * @esi_route ~get_universe_races
     *
     * @returns Information about the race
     */
    details() {
        return getRaces(this.agent)
            .then(all => r.impl.filterArray(all, this.id_, r => r.race_id));
    }
}
exports.Race = Race;
/**
 * An api adapter for accessing various details of multiple race ids,
 * specified by a provided an array or set of ids when the api is instantiated.
 */
class MappedRaces extends r.impl.SimpleMappedResource {
    constructor(agent, ids) {
        super(ids);
        this.agent = agent;
    }
    /**
     * @esi_route ~get_universe_races
     *
     * @returns Race details mapped by race id
     */
    details() {
        return this.arrayIDs().then(ids => {
            return getRaces(this.agent)
                .then(all => r.impl.filterArrayToMap(all, ids, r => r.race_id));
        });
    }
}
exports.MappedRaces = MappedRaces;
/**
 * An api adapter for accessing various details about every race in the game.
 */
class IteratedRaces extends r.impl.SimpleIteratedResource {
    constructor(agent) {
        super(r.impl.makeArrayStreamer(() => agent.request('get_universe_races', undefined)), r => r.race_id);
        this.agent = agent;
    }
    /**
     * @esi_route get_universe_races
     *
     * @returns Iterator over details of all in-game races
     */
    details() {
        return this.getPaginatedResource();
    }
}
exports.IteratedRaces = IteratedRaces;
/**
 * Create a new Races instance that uses the given `agent` to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns A Races instance
 */
function makeRaces(agent) {
    return function (ids) {
        if (ids === undefined) {
            // All races since no id
            return new IteratedRaces(agent);
        }
        else if (typeof ids === 'number') {
            // Single id so single API
            return new Race(agent, ids);
        }
        else {
            // Set or array, so mapped API
            return new MappedRaces(agent, ids);
        }
    };
}
exports.makeRaces = makeRaces;
function getRaces(agent) {
    return agent.request('get_universe_races', undefined);
}
//# sourceMappingURL=races.js.map