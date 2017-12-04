"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const r = require("../../internal/resource-api");
const moons_1 = require("./moons");
/**
 * An api adapter for accessing various details of a single planet,
 * specified by a provided id when the api is instantiated.
 */
class Planet extends r.impl.SimpleResource {
    constructor(agent, id) {
        super(id);
        this.agent = agent;
    }
    /**
     * @returns Information about the planet
     */
    details() {
        return getDetails(this.agent, this.id_);
    }
    /**
     * @esi_route ~get_universe_systems_system_id
     *
     * @returns A MappedMoons instance for all the moons of the planet
     */
    get moons() {
        if (this.moons_ === undefined) {
            this.moons_ = new moons_1.MappedMoons(this.agent, () => getMoonsForPlanet(this.agent, this.id_));
        }
        return this.moons_;
    }
}
exports.Planet = Planet;
/**
 * An api adapter for accessing various details of multiple planet ids,
 * specified by a provided an array or set of ids when the api is instantiated.
 */
class MappedPlanets extends r.impl.SimpleMappedResource {
    constructor(agent, ids) {
        super(ids);
        this.agent = agent;
    }
    /**
     * @returns Planet details mapped by planet id
     */
    details() {
        return this.getResource(id => getDetails(this.agent, id));
    }
}
exports.MappedPlanets = MappedPlanets;
/**
 * Create a new Planets instance that uses the given `agent` to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns A Planets instance
 */
function makePlanets(agent) {
    return function (ids) {
        if (typeof ids === 'number') {
            // Single id so single API
            return new Planet(agent, ids);
        }
        else {
            // Set or array, so mapped API
            return new MappedPlanets(agent, ids);
        }
    };
}
exports.makePlanets = makePlanets;
function getDetails(agent, id) {
    return agent.request('get_universe_planets_planet_id', { path: { planet_id: id } });
}
function getMoonsForPlanet(agent, id) {
    return getDetails(agent, id)
        .then(details => agent.request('get_universe_systems_system_id', { path: { system_id: details.system_id } }))
        .then(system => {
        for (let p of system.planets) {
            if (p.planet_id === id) {
                return p.moons || [];
            }
        }
        return [];
    });
}
//# sourceMappingURL=planets.js.map