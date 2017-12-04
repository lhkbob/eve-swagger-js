"use strict";
var __asyncValues = (this && this.__asyncIterator) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator];
    return m ? m.call(o) : typeof __values === "function" ? __values(o) : o[Symbol.iterator]();
};
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
var __asyncDelegator = (this && this.__asyncDelegator) || function (o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { if (o[n]) i[n] = function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; }; }
};
Object.defineProperty(exports, "__esModule", { value: true });
const search_1 = require("../internal/search");
const r = require("../internal/resource-api");
const corporations_1 = require("./corporation/corporations");
const solar_systems_1 = require("./universe/solar-systems");
/**
 * An api adapter for accessing various details of a single faction, specified
 * by a provided id when the api is instantiated.
 */
class Faction extends r.impl.SimpleResource {
    constructor(agent, id_) {
        super(id_);
        this.agent = agent;
    }
    /**
     * @esi_route ~get_universe_factions
     *
     * @returns The public info of the faction
     */
    details() {
        return getFactions(this.agent)
            .then(all => r.impl.filterArray(all, this.id_, e => e.faction_id));
    }
    /**
     * @esi_route ~get_universe_factions
     *
     * @returns The name of the faction
     */
    names() {
        return this.details().then(d => d.name);
    }
    /**
     * @esi_route ~get_fw_stats
     *
     * @returns The faction warfare statistics for this faction
     */
    stats() {
        return getStats(this.agent)
            .then(all => r.impl.filterArray(all, this.id_, e => e.faction_id));
    }
    /**
     * @esi_route ~get_fw_wars
     *
     * @returns The faction ids of factions involved in war with this faction
     */
    wars() {
        return getWars(this.agent).then(all => getWarsForFaction(all, this.id_));
    }
    /**
     * @esi_route ~get_fw_systems
     *
     * @returns The statuses of all systems owned by the faction's militia
     */
    owned() {
        return getSystems(this.agent).then(all => getOwnedSystems(all, this.id_));
    }
    /**
     * @esi_route ~get_fw_systems
     *
     * @returns The statuses of all systems occupied by the faction's militia
     */
    occupied() {
        return getSystems(this.agent)
            .then(all => getOccupiedSystems(all, this.id_));
    }
    /**
     * @esi_route ids ~get_universe_factions
     *
     * @returns A Corporation API instance linked with the corporation id of the
     *     faction
     */
    get corporation() {
        if (this.corp_ === undefined) {
            this.corp_ = new corporations_1.Corporation(this.agent, () => this.details().then(d => d.corporation_id));
        }
        return this.corp_;
    }
    /**
     * @esi_route ids ~get_universe_factions
     *
     * @returns A Corporation API instance linked with the militia corporation of
     *     the faction
     */
    get militia() {
        if (this.militia_ === undefined) {
            this.militia_ = new corporations_1.Corporation(this.agent, () => this.details().then(d => d.militia_corporation_id || 0));
        }
        return this.militia_;
    }
    /**
     * @esi_route ids ~get_fw_systems [owned]
     *
     * @returns A MappedSolarSystems API dynamically linked with solar system ids
     *     that are owned by the faction's militia
     */
    get ownedSystems() {
        if (this.owned_ === undefined) {
            this.owned_ = new solar_systems_1.MappedSolarSystems(this.agent, () => this.owned()
                .then(systems => systems.map(s => s.owner_faction_id)));
        }
        return this.owned_;
    }
    /**
     * @esi_route ids ~get_fw_systems [occupied]
     *
     * @returns A MappedSolarSystems API dynamically linked with the solar system
     *     ids that are occupied by the faction's militia
     */
    get occupiedSystems() {
        if (this.occupied_ === undefined) {
            this.occupied_ = new solar_systems_1.MappedSolarSystems(this.agent, () => this.owned()
                .then(systems => systems.map(s => s.occupier_faction_id)));
        }
        return this.occupied_;
    }
}
exports.Faction = Faction;
/**
 * An api adapter for accessing various details of multiple faction, specified
 * by a provided an array, set of ids, or search query when the api is
 * instantiated.
 */
class MappedFactions extends r.impl.SimpleMappedResource {
    constructor(agent, ids) {
        super(ids);
        this.agent = agent;
    }
    /**
     * @esi_route ~get_universe_factions
     *
     * @returns The public info of the factions, mapped by id
     */
    details() {
        return this.arrayIDs()
            .then(ids => getFactions(this.agent)
            .then(all => r.impl.filterArrayToMap(all, ids, e => e.faction_id)));
    }
    /**
     * @esi_route ~get_universe_factions
     *
     * @returns The names of the factions, mapped by id
     */
    names() {
        return this.details().then(map => {
            let remap = new Map();
            for (let [k, v] of map.entries()) {
                remap.set(k, v.name);
            }
            return remap;
        });
    }
    /**
     * @esi_route ~get_fw_stats
     *
     * @returns The faction warfare statistics for the factions, mapped by id
     */
    stats() {
        return this.arrayIDs().then(ids => getStats(this.agent)
            .then(all => r.impl.filterArrayToMap(all, ids, e => e.faction_id)));
    }
    /**
     * @esi_route ~get_fw_wars
     *
     * @returns The faction ids involved in wars against each faction
     */
    wars() {
        return this.arrayIDs().then(ids => getWars(this.agent).then(wars => {
            let mapped = new Map();
            for (let id of ids) {
                mapped.set(id, getWarsForFaction(wars, id));
            }
            return mapped;
        }));
    }
    /**
     * @esi_route ~get_fw_systems [owned]
     *
     * @returns The statuses of all systems owned by the faction's militia
     */
    owned() {
        return this.arrayIDs().then(ids => getSystems(this.agent).then(all => {
            let mapped = new Map();
            for (let id of ids) {
                mapped.set(id, getOwnedSystems(all, id));
            }
            return mapped;
        }));
    }
    /**
     * @esi_route ~get_fw_systems [occupied]
     *
     * @returns The statuses of all systems occupied by the faction's militia
     */
    occupied() {
        return this.arrayIDs().then(ids => getSystems(this.agent)
            .then(all => {
            let mapped = new Map();
            for (let id of ids) {
                mapped.set(id, getOccupiedSystems(all, id));
            }
            return mapped;
        }));
    }
}
exports.MappedFactions = MappedFactions;
/**
 * An api adapter for accessing various details about every faction in the
 * game. Even though a route exists to get all faction ids at once, due to
 * their quantity, the API provides asynchronous iterators for the rest of their
 * details.
 */
class IteratedFactions extends r.impl.SimpleIteratedResource {
    constructor(agent) {
        super(r.impl.makeArrayStreamer(() => getFactions(agent)), e => e.faction_id);
        this.agent = agent;
    }
    /**
     * @esi_route get_universe_factions
     *
     * @returns Iterator for details of every faction
     */
    details() {
        return this.getPaginatedResource();
    }
    /**
     * @esi_route ~get_universe_factions
     *
     * @returns Iterator for the names of every faction
     */
    names() {
        return __asyncGenerator(this, arguments, function* names_1() {
            try {
                for (var _a = __asyncValues(this.details()), _b; _b = yield __await(_a.next()), !_b.done;) {
                    let [id, details] = yield __await(_b.value);
                    yield [id, details.name];
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_b && !_b.done && (_c = _a.return)) yield __await(_c.call(_a));
                }
                finally { if (e_1) throw e_1.error; }
            }
            var e_1, _c;
        });
    }
    /**
     * @esi_route get_fw_stats
     *
     * @returns Iterator over stats of every faction
     */
    stats() {
        return __asyncGenerator(this, arguments, function* stats_1() {
            let stats = yield __await(getStats(this.agent));
            for (let s of stats) {
                yield [s.faction_id, s];
            }
        });
    }
    /**
     * @esi_route get_fw_wars
     *
     * @returns Iterator over the wars each faction is involved in
     */
    wars() {
        return __asyncGenerator(this, arguments, function* wars_1() {
            let wars = yield __await(getWars(this.agent));
            let groups = new Map();
            for (let w of wars) {
                let f1 = groups.get(w.faction_id);
                let f2 = groups.get(w.against_id);
                if (f1 === undefined) {
                    f1 = new Set();
                    groups.set(w.faction_id, f1);
                }
                if (f2 === undefined) {
                    f2 = new Set();
                    groups.set(w.faction_id, f2);
                }
                f1.add(w.against_id);
                f2.add(w.faction_id);
            }
            // Now that they are grouped, yield each one
            yield __await(yield* __asyncDelegator(__asyncValues(groups.entries())));
        });
    }
    /**
     * @esi_route get_fw_systems [owned]
     *
     * @returns Iterator over the systems owned by each faction
     */
    owned() {
        return __asyncGenerator(this, arguments, function* owned_1() {
            let systems = yield __await(getSystems(this.agent));
            let groups = new Map();
            for (let s of systems) {
                let owned = groups.get(s.owner_faction_id);
                if (owned === undefined) {
                    owned = [s];
                    groups.set(s.owner_faction_id, owned);
                }
                else {
                    owned.push(s);
                }
            }
            yield __await(yield* __asyncDelegator(__asyncValues(groups.entries())));
        });
    }
    /**
     * @esi_route get_fw_systems [occupied]
     *
     * @returns Iterator over the systems occupied by each faction
     */
    occupied() {
        return __asyncGenerator(this, arguments, function* occupied_1() {
            let systems = yield __await(getSystems(this.agent));
            let groups = new Map();
            for (let s of systems) {
                let occupied = groups.get(s.occupier_faction_id);
                if (occupied === undefined) {
                    occupied = [s];
                    groups.set(s.occupier_faction_id, occupied);
                }
                else {
                    occupied.push(s);
                }
            }
            yield __await(yield* __asyncDelegator(__asyncValues(groups.entries())));
        });
    }
}
exports.IteratedFactions = IteratedFactions;
/**
 * API wrapper around faction warfare leaderboards, measuring performance
 * over the recent past.
 */
class Leaderboard {
    constructor(agent) {
        this.agent = agent;
    }
    /**
     * @returns Leaderboard of factions in faction warfare
     */
    forFactions() {
        return this.agent.request('get_fw_leaderboards', undefined);
    }
    /**
     * @returns Leaderboard of characters participating in faction warfare
     */
    forCharacters() {
        return this.agent.request('get_fw_leaderboards_characters', undefined);
    }
    /**
     * @returns Leaderboard of militia corporations participating in faction
     *     warfare
     */
    forCorporations() {
        return this.agent.request('get_fw_leaderboards_corporations', undefined);
    }
}
exports.Leaderboard = Leaderboard;
/**
 * Create a new factions API that uses the given `agent` to make its
 * HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns A new Factions
 */
function makeFactions(agent) {
    // First create a search function for factions using the agent
    const factionSearch = search_1.makeDefaultSearch(agent, "faction" /* FACTION */);
    let factions = function (ids, strict = false) {
        if (ids === undefined) {
            // No argument
            return new IteratedFactions(agent);
        }
        else if (typeof ids === 'number') {
            // Single id variant
            return new Faction(agent, ids);
        }
        else if (typeof ids === 'string') {
            // Search variant that uses the IDSetProvider variant
            return new MappedFactions(agent, () => factionSearch(ids, strict));
        }
        else {
            // Either a set or an array
            return new MappedFactions(agent, ids);
        }
    };
    factions.systemStatuses = function () {
        return agent.request('get_fw_systems', undefined);
    };
    factions.leaderboard = new Leaderboard(agent);
    return factions;
}
exports.makeFactions = makeFactions;
function getWarsForFaction(wars, faction) {
    let forFaction = new Set();
    for (let w of wars) {
        if (w.faction_id === faction) {
            forFaction.add(w.against_id);
        }
        else if (w.against_id === faction) {
            forFaction.add(w.faction_id);
        }
    }
    return forFaction;
}
function getOwnedSystems(systems, faction) {
    return systems.filter(s => s.owner_faction_id === faction);
}
function getOccupiedSystems(systems, faction) {
    return systems.filter(s => s.occupier_faction_id === faction);
}
function getFactions(agent) {
    return agent.request('get_universe_factions', undefined);
}
function getStats(agent) {
    return agent.request('get_fw_stats', undefined);
}
function getWars(agent) {
    return agent.request('get_fw_wars', undefined);
}
function getSystems(agent) {
    return agent.request('get_fw_systems', undefined);
}
//# sourceMappingURL=factions.js.map