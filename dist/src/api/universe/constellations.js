"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const search_1 = require("../../internal/search");
const names_1 = require("../../internal/names");
const r = require("../../internal/resource-api");
const solar_systems_1 = require("./solar-systems");
/**
 * An api adapter for accessing various details of a single in-game
 * constellation, specified by a provided id when the api is instantiated.
 */
class Constellation extends r.impl.SimpleResource {
    constructor(agent, id) {
        super(id);
        this.agent = agent;
    }
    /**
     * @returns A MappedSolarSystems instance tied to the solar systems referenced
     *    by the details of this constellation
     */
    get solarSystems() {
        if (this.systems_ === undefined) {
            this.systems_ = new solar_systems_1.MappedSolarSystems(this.agent, () => this.details().then(r => r.systems));
        }
        return this.systems_;
    }
    /**
     * @returns Information about the constellation
     */
    details() {
        return getDetails(this.agent, this.id_);
    }
    /**
     * @esi_route ~get_universe_constellations_constellation_id
     *
     * @returns The name of the constellation
     */
    names() {
        return this.details().then(result => result.name);
    }
}
exports.Constellation = Constellation;
/**
 * An api adapter for accessing various details of multiple constellation ids,
 * specified by a provided an array or set of ids when the api is instantiated.
 */
class MappedConstellations extends r.impl.SimpleMappedResource {
    constructor(agent, ids) {
        super(ids);
        this.agent = agent;
    }
    /**
     * @returns Constellation details mapped by constellation id
     */
    details() {
        return this.getResource(id => getDetails(this.agent, id));
    }
    /**
     * @esi_route post_universe_names [constellation]
     *
     * @returns The names for each of the mapped constellations
     */
    names() {
        return this.arrayIDs()
            .then(ids => names_1.getNames(this.agent, "constellation" /* CONSTELLATION */, ids));
    }
}
exports.MappedConstellations = MappedConstellations;
/**
 * An api adapter for accessing various details about every constellation in
 * the game.
 */
class IteratedConstellations extends r.impl.SimpleIteratedResource {
    constructor(agent) {
        super(r.impl.makeArrayStreamer(() => agent.request('get_universe_constellations', undefined)), id => id);
        this.agent = agent;
    }
    /**
     * @returns Iterator over details of all in-game constellations
     */
    details() {
        return this.getResource(id => getDetails(this.agent, id));
    }
    /**
     * @esi_route post_universe_names [constellation]
     *
     * @returns Iterator over constellation names
     */
    names() {
        return names_1.getIteratedNames(this.agent, "constellation" /* CONSTELLATION */, this.ids());
    }
}
exports.IteratedConstellations = IteratedConstellations;
/**
 * Create a new Constellations instance that uses the given `agent` to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns A Constellations instance
 */
function makeConstellations(agent) {
    const constellationSearch = search_1.makeDefaultSearch(agent, "constellation" /* CONSTELLATION */);
    return function (ids, strict = false) {
        if (ids === undefined) {
            // All constellations since no id
            return new IteratedConstellations(agent);
        }
        else if (typeof ids === 'number') {
            // Single id so single API
            return new Constellation(agent, ids);
        }
        else if (typeof ids === 'string') {
            // Search query for mapped API
            return new MappedConstellations(agent, () => constellationSearch(ids, strict));
        }
        else {
            // Set or array, so mapped API
            return new MappedConstellations(agent, ids);
        }
    };
}
exports.makeConstellations = makeConstellations;
function getDetails(agent, id) {
    return agent.request('get_universe_constellations_constellation_id', { path: { constellation_id: id } });
}
//# sourceMappingURL=constellations.js.map