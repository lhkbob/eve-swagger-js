"use strict";
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);  }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const search_1 = require("../../internal/search");
const names_1 = require("../../internal/names");
const r = require("../../internal/resource-api");
const stars_1 = require("./stars");
const stargates_1 = require("./stargates");
const planets_1 = require("./planets");
const stations_1 = require("./stations");
/**
 * An api adapter for accessing various details of a single solar system,
 * specified by a provided id when the api is instantiated.
 */
class SolarSystem extends r.impl.SimpleResource {
    constructor(agent, id) {
        super(id);
        this.agent = agent;
    }
    /**
     * @returns A MappedStations instance tied to the stations referenced in the
     *    details of this solar system
     */
    get stations() {
        if (this.stations_ === undefined) {
            this.stations_ = new stations_1.MappedStations(this.agent, () => this.details().then(r => r.stations || []));
        }
        return this.stations_;
    }
    /**
     * @returns A Star API interface tied to the star referenced in the details
     *    of this solar system
     */
    get star() {
        if (this.star_ === undefined) {
            this.star_ = new stars_1.Star(this.agent, () => this.details().then(r => r.star_id));
        }
        return this.star_;
    }
    /**
     * @returns A MappedStargates instance tied to the stargates referenced in
     *    the details of this solar system
     */
    get stargates() {
        if (this.gates_ === undefined) {
            this.gates_ = new stargates_1.MappedStargates(this.agent, () => this.details().then(r => r.stargates || []));
        }
        return this.gates_;
    }
    /**
     * @returns A MappedPlanets instance tied to the planets referenced in the
     *    details of this solar system
     */
    get planets() {
        if (this.planets_ === undefined) {
            this.planets_ = new planets_1.MappedPlanets(this.agent, () => this.details().then(r => r.planets.map(p => p.planet_id)));
        }
        return this.planets_;
    }
    /**
     * @esi_route get_route_origin_destination [shortest]
     *
     * @param to Destination solar system id
     * @param avoid Optional list of solar systems to avoid
     * @param connections Optional list of solar systems to pass through
     * @returns Route specified by ordered solar system ids
     */
    shortestRoute(to, avoid, connections) {
        return this.getRoute('shortest', to, avoid, connections);
    }
    /**
     * @esi_route get_route_origin_destination [secure]
     *
     * @param to Destination solar system id
     * @param avoid Optional list of solar systems to avoid
     * @param connections Optional list of solar systems to pass through
     * @returns Route specified by ordered solar system ids
     */
    secureRoute(to, avoid, connections) {
        return this.getRoute('secure', to, avoid, connections);
    }
    /**
     * @esi_route get_route_origin_destination [insecure]
     * @esi_example esi.solarSystems(fromId).insecureRoute(toId, ...)
     *
     * @param to Destination solar system id
     * @param avoid Optional list of solar systems to avoid
     * @param connections Optional list of solar systems to pass through
     */
    insecureRoute(to, avoid, connections) {
        return this.getRoute('insecure', to, avoid, connections);
    }
    getRoute(type, to, avoid, connections) {
        // Build up multi level connections array
        let pairedConnections;
        if (connections !== undefined) {
            pairedConnections = [];
            for (let i = 0; i < connections.length - 1; i++) {
                pairedConnections.push([connections[i], connections[i + 1]]);
            }
        }
        return this.agent.request('get_route_origin_destination', {
            path: { origin: this.id_, destination: to }, query: {
                flag: type, avoid: avoid, connections: pairedConnections
            }
        });
    }
    /**
     * @returns Information about the solar system
     */
    details() {
        return getDetails(this.agent, this.id_);
    }
    /**
     * @esi_route ~get_universe_system_jumps
     *
     * @returns The number of recent jumps through the system
     */
    jumpStats() {
        return getJumpStats(this.agent)
            .then(all => r.impl.filterArray(all, this.id_, e => e.system_id))
            .then(stats => stats.ship_jumps);
    }
    /**
     * @esi_route ~get_universe_system_kills
     *
     * @returns The number of recent kills through the system
     */
    killStats() {
        return getKillStats(this.agent)
            .then(all => r.impl.filterArray(all, this.id_, e => e.system_id));
    }
    /**
     * @esi_route ~get_sovereignty_map
     *
     * @returns Sovereignty control information for the system
     */
    sovereignty() {
        return getSovereignty(this.agent)
            .then(all => r.impl.filterArray(all, this.id_, e => e.system_id));
    }
    /**
     * @esi_route ~get_industry_systems
     *
     * @returns Industry cost indices for the system
     */
    costIndices() {
        return getCostIndices(this.agent)
            .then(all => r.impl.filterArray(all, this.id_, e => e.solar_system_id))
            .then(costs => costs.cost_indices);
    }
    /**
     * @esi_route ~get_universe_systems_system_id
     *
     * @returns The name of the solar system
     */
    names() {
        return this.details().then(result => result.name);
    }
}
exports.SolarSystem = SolarSystem;
/**
 * An api adapter for accessing various details of multiple solar system ids,
 * specified by a provided an array or set of ids when the api is instantiated.
 */
class MappedSolarSystems extends r.impl.SimpleMappedResource {
    constructor(agent, ids) {
        super(ids);
        this.agent = agent;
    }
    /**
     * @returns SolarSystem details mapped by solar system id
     */
    details() {
        return this.getResource(id => getDetails(this.agent, id));
    }
    /**
     * @esi_route ~get_universe_system_jumps
     *
     * @returns Jump stats for the specified solar systems
     */
    jumpStats() {
        return this.arrayIDs().then(ids => {
            return getJumpStats(this.agent)
                .then(all => r.impl.filterArrayToMap(all, ids, e => e.system_id))
                .then(objMap => {
                let numMap = new Map();
                for (let [k, v] of objMap.entries()) {
                    numMap.set(k, v.ship_jumps);
                }
                return numMap;
            });
        });
    }
    /**
     * @esi_route ~get_universe_system_kills
     *
     * @returns Kill statistics for the specified solar systems
     */
    killStats() {
        return this.arrayIDs().then(ids => {
            return getKillStats(this.agent)
                .then(all => r.impl.filterArrayToMap(all, ids, e => e.system_id));
        });
    }
    /**
     * @esi_route ~get_sovereignty_map
     *
     * @returns Sovereignty information for the specified solar systems
     */
    sovereignty() {
        return this.arrayIDs().then(ids => {
            return getSovereignty(this.agent)
                .then(all => r.impl.filterArrayToMap(all, ids, e => e.system_id));
        });
    }
    /**
     * @esi_route ~get_industry_systems
     *
     * @returns Cost indices for the specified solar systems
     */
    costIndices() {
        return this.arrayIDs().then(ids => {
            return getCostIndices(this.agent)
                .then(all => r.impl.filterArrayToMap(all, ids, e => e.solar_system_id))
                .then(objMap => {
                let aMap = new Map();
                for (let [k, v] of objMap.entries()) {
                    aMap.set(k, v.cost_indices);
                }
                return aMap;
            });
        });
    }
    /**
     * @esi_route post_universe_names [system]
     *
     * @returns The specified solar systems' names
     */
    names() {
        return this.arrayIDs()
            .then(ids => names_1.getNames(this.agent, "solar_system" /* SOLAR_SYSTEM */, ids));
    }
}
exports.MappedSolarSystems = MappedSolarSystems;
/**
 * An api adapter for accessing various details about every solar system in the
 * universe.
 */
class IteratedSolarSystems extends r.impl.SimpleIteratedResource {
    constructor(agent) {
        super(r.impl.makeArrayStreamer(() => agent.request('get_universe_systems', undefined)), id => id);
        this.agent = agent;
    }
    /**
     * @returns The details of every solar system in the universe
     */
    details() {
        return this.getResource(id => getDetails(this.agent, id));
    }
    /**
     * @esi_route get_universe_system_jumps
     *
     * @returns Jump statistics for every solar system in the universe, besides
     *    worm hole systems
     */
    jumpStats() {
        return __asyncGenerator(this, arguments, function* jumpStats_1() {
            let stats = yield __await(getJumpStats(this.agent));
            for (let s of stats) {
                yield [s.system_id, s.ship_jumps];
            }
        });
    }
    /**
     * @esi_route get_universe_system_kills
     *
     * @returns Kill statistics for every solar system in the universe, besides
     *    worm hole systems
     */
    killStats() {
        return __asyncGenerator(this, arguments, function* killStats_1() {
            let stats = yield __await(getKillStats(this.agent));
            for (let s of stats) {
                yield [s.system_id, s];
            }
        });
    }
    /**
     * @esi_route get_sovereignty_map
     *
     * @returns Sovereignty information for all solar systems
     */
    sovereignty() {
        return __asyncGenerator(this, arguments, function* sovereignty_1() {
            let sov = yield __await(getSovereignty(this.agent));
            for (let s of sov) {
                yield [s.system_id, s];
            }
        });
    }
    /**
     * @esi_route get_industry_systems
     *
     * @returns Industry cost indices for all solar systems
     */
    costIndices() {
        return __asyncGenerator(this, arguments, function* costIndices_1() {
            let costs = yield __await(getCostIndices(this.agent));
            for (let c of costs) {
                yield [
                    c.solar_system_id, c.cost_indices
                ];
            }
        });
    }
    /**
     * @esi_route post_universe_names [system]
     *
     * @returns Names of all solar systems in the universe
     */
    names() {
        return names_1.getIteratedNames(this.agent, "solar_system" /* SOLAR_SYSTEM */, this.ids());
    }
}
exports.IteratedSolarSystems = IteratedSolarSystems;
/**
 * Create a new SolarSystems instance that uses the given `agent` to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns A SolarSystems instance
 */
function makeSolarSystems(agent) {
    const systemSearch = search_1.makeDefaultSearch(agent, "solarsystem" /* SOLARSYSTEM */);
    return function (ids, strict = false) {
        if (ids === undefined) {
            // No id, so all solar systems
            return new IteratedSolarSystems(agent);
        }
        else if (typeof ids === 'number') {
            // Single id so single API
            return new SolarSystem(agent, ids);
        }
        else if (typeof ids === 'string') {
            // Search query, so mapped API with dynamic ids
            return new MappedSolarSystems(agent, () => systemSearch(ids, strict));
        }
        else {
            // Set or array, so mapped API with fixed ids
            return new MappedSolarSystems(agent, ids);
        }
    };
}
exports.makeSolarSystems = makeSolarSystems;
function getDetails(agent, id) {
    return agent.request('get_universe_systems_system_id', { path: { system_id: id } });
}
function getJumpStats(agent) {
    return agent.request('get_universe_system_jumps', undefined);
}
function getKillStats(agent) {
    return agent.request('get_universe_system_kills', undefined);
}
function getSovereignty(agent) {
    return agent.request('get_sovereignty_map', undefined);
}
function getCostIndices(agent) {
    return agent.request('get_industry_systems', undefined);
}
//# sourceMappingURL=solar-systems.js.map