"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const races_1 = require("./races");
const bloodlines_1 = require("./bloodlines");
const stars_1 = require("./stars");
const planets_1 = require("./planets");
const moons_1 = require("./moons");
const stargates_1 = require("./stargates");
const regions_1 = require("./regions");
const constellations_1 = require("./constellations");
const stations_1 = require("./stations");
const solar_systems_1 = require("./solar-systems");
const search_1 = require("../../internal/search");
/**
 * A simple wrapper around functional interfaces for getting APIs for regions,
 * solar systems, constellations, races, bloodlines, etc.
 *
 * - [universe](https://esi.tech.ccp.is/latest/#/Universe)
 * - [industry](https://esi.tech.ccp.is/latest/#/Industry)
 * - [incursions](https://esi.tech.ccp.is/latest/#/Incursions)
 * - [sovereignty](https://esi.tech.ccp.is/latest/#/Sovereignty)
 * - [market](https://esi.tech.ccp.is/latest/#/Market)
 */
class Universe {
    constructor(agent) {
        this.agent = agent;
    }
    get races() {
        if (this.races_ === undefined) {
            this.races_ = races_1.makeRaces(this.agent);
        }
        return this.races_;
    }
    get bloodlines() {
        if (this.bloodlines_ === undefined) {
            this.bloodlines_ = bloodlines_1.makeBloodlines(this.agent);
        }
        return this.bloodlines_;
    }
    get stars() {
        if (this.stars_ === undefined) {
            this.stars_ = stars_1.makeStars(this.agent);
        }
        return this.stars_;
    }
    get planets() {
        if (this.planets_ === undefined) {
            this.planets_ = planets_1.makePlanets(this.agent);
        }
        return this.planets_;
    }
    get moons() {
        if (this.moons_ === undefined) {
            this.moons_ = moons_1.makeMoons(this.agent);
        }
        return this.moons_;
    }
    get stargates() {
        if (this.stargates_ === undefined) {
            this.stargates_ = stargates_1.makeStargates(this.agent);
        }
        return this.stargates_;
    }
    get regions() {
        if (this.regions_ === undefined) {
            this.regions_ = regions_1.makeRegions(this.agent);
        }
        return this.regions_;
    }
    get constellations() {
        if (this.constellations_ === undefined) {
            this.constellations_ = constellations_1.makeConstellations(this.agent);
        }
        return this.constellations_;
    }
    get stations() {
        if (this.stations_ === undefined) {
            this.stations_ = stations_1.makeStations(this.agent);
        }
        return this.stations_;
    }
    get solarSystems() {
        if (this.solarSystems_ === undefined) {
            this.solarSystems_ = solar_systems_1.makeSolarSystems(this.agent);
        }
        return this.solarSystems_;
    }
    /**
     * @returns All player-created freeport citadels
     */
    freeports() {
        return this.agent.request('get_universe_structures', undefined);
    }
    /**
     * @esi_route get_search [agent]
     *
     * @param query Search terms
     * @param strict Whether or not the search is strict, defaults to false
     * @returns Agent ids matching the search terms
     */
    agents(query, strict = false) {
        if (this.agents_ === undefined) {
            this.agents_ = search_1.makeDefaultSearch(this.agent, "agent" /* AGENT */);
        }
        return this.agents_(query, strict);
    }
    /**
     * @esi_route get_search [wormhole]
     *
     * @param query Search terms
     * @param strict Whether or not the search is strict, defaults to false
     * @returns Wormhole ids matching the search terms
     */
    wormholes(query, strict = false) {
        if (this.wormholes_ === undefined) {
            this.wormholes_ = search_1.makeDefaultSearch(this.agent, "wormhole" /* WORMHOLE */);
        }
        return this.wormholes_(query, strict);
    }
    /**
     * @returns Details on all active incursions in the universe
     */
    incursions() {
        return this.agent.request('get_incursions', undefined);
    }
}
exports.Universe = Universe;
//# sourceMappingURL=index.js.map