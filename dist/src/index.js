"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const esi_agent_1 = require("./internal/esi-agent");
const names_1 = require("./internal/names");
const agents_1 = require("./api/universe/agents");
const bloodlines_1 = require("./api/universe/bloodlines");
const constellations_1 = require("./api/universe/constellations");
const dogma_1 = require("./api/universe/dogma");
const factions_1 = require("./api/universe/factions");
const freeports_1 = require("./api/universe/freeports");
const graphics_1 = require("./api/universe/graphics");
const industry_1 = require("./api/universe/industry");
const insurance_1 = require("./api/universe/insurance");
const moons_1 = require("./api/universe/moons");
const opportunities_1 = require("./api/universe/opportunities");
const planets_1 = require("./api/universe/planets");
const planetary_interaction_1 = require("./api/universe/planetary-interaction");
const races_1 = require("./api/universe/races");
const regions_1 = require("./api/universe/regions");
const solar_systems_1 = require("./api/universe/solar-systems");
const stargates_1 = require("./api/universe/stargates");
const stations_1 = require("./api/universe/stations");
const types_1 = require("./api/universe/types");
const wormholes_1 = require("./api/universe/wormholes");
const alliances_1 = require("./api/alliances");
const corporations_1 = require("./api/corporations");
const incursions_1 = require("./api/incursions");
const killmail_1 = require("./api/killmail");
const sovereignty_1 = require("./api/sovereignty");
const wars_1 = require("./api/wars");
const characters_1 = require("./api/character/characters");
__export(require("./error"));
/**
 * The default configuration that specifies values for parameters that aren't
 * explicitly given when {@link makeAPI} is called.
 */
exports.DEFAULT_CONFIG = {
    url: 'https://esi.evetech.net',
    source: 'tranquility',
    userAgent: 'eve-swagger | https://github.com/lhkbob/eve-swagger-js',
    language: "en-us" /* EN_US */,
    timeout: 6000,
    maxConcurrentRequests: 0,
    minTimeBetweenRequests: 0,
    maxQueueSize: -1,
    respectErrorLimit: true,
    maxResponseTTL: Number.POSITIVE_INFINITY,
    errorTTL: 5 * 60 * 1000,
    accessTokenTTL: 10 * 60 * 1000,
    userAgentDelivery: 'x-header',
    accessTokenDelivery: 'header'
};
/**
 * Create a new API with the given configuration provided in a single
 * object map. Any parameter that is not provided will use the default value
 * in {@link DEFAULT_CONFIG}.
 *
 * It is strongly recommended that a custom user agent be provided.
 *
 * @param config The configuration for the API
 * @returns The API instance
 */
function makeAPI(config = {}) {
    let fullConfig = Object.assign({}, exports.DEFAULT_CONFIG, config);
    return new APIImpl(fullConfig);
}
exports.makeAPI = makeAPI;
class APIImpl {
    constructor(config) {
        this.agent = new esi_agent_1.ESIAgent(config);
    }
    get characters() {
        if (this.charsAPI === undefined) {
            this.charsAPI = characters_1.makeCharacters(this.agent);
        }
        return this.charsAPI;
    }
    get agents() {
        if (this.agentsAPI === undefined) {
            this.agentsAPI = agents_1.makeAgents(this.agent);
        }
        return this.agentsAPI;
    }
    get bloodlines() {
        if (this.bloodAPI === undefined) {
            this.bloodAPI = bloodlines_1.makeBloodlines(this.agent);
        }
        return this.bloodAPI;
    }
    get constellations() {
        if (this.constAPI === undefined) {
            this.constAPI = constellations_1.makeConstellations(this.agent);
        }
        return this.constAPI;
    }
    get dogma() {
        if (this.dogmaAPI === undefined) {
            this.dogmaAPI = dogma_1.makeDogma(this.agent);
        }
        return this.dogmaAPI;
    }
    get factions() {
        if (this.factionAPI === undefined) {
            this.factionAPI = factions_1.makeFactions(this.agent);
        }
        return this.factionAPI;
    }
    get freeports() {
        if (this.freeportAPI === undefined) {
            this.freeportAPI = freeports_1.makeFreeports(this.agent);
        }
        return this.freeportAPI;
    }
    get graphics() {
        if (this.graphicsAPI === undefined) {
            this.graphicsAPI = graphics_1.makeGraphics(this.agent);
        }
        return this.graphicsAPI;
    }
    get industry() {
        if (this.indyAPI === undefined) {
            this.indyAPI = industry_1.makeIndustry(this.agent);
        }
        return this.indyAPI;
    }
    get insurance() {
        if (this.insuranceAPI === undefined) {
            this.insuranceAPI = insurance_1.makeInsurance(this.agent);
        }
        return this.insuranceAPI;
    }
    get moons() {
        if (this.moonAPI === undefined) {
            this.moonAPI = moons_1.makeMoons(this.agent);
        }
        return this.moonAPI;
    }
    get opportunities() {
        if (this.opportunityAPI === undefined) {
            this.opportunityAPI = opportunities_1.makeOpportunities(this.agent);
        }
        return this.opportunityAPI;
    }
    get planets() {
        if (this.planetAPI === undefined) {
            this.planetAPI = planets_1.makePlanets(this.agent);
        }
        return this.planetAPI;
    }
    get pi() {
        if (this.piAPI === undefined) {
            this.piAPI = planetary_interaction_1.makePlanetaryInteraction(this.agent);
        }
        return this.piAPI;
    }
    get races() {
        if (this.raceAPI === undefined) {
            this.raceAPI = races_1.makeRaces(this.agent);
        }
        return this.raceAPI;
    }
    get regions() {
        if (this.regionAPI === undefined) {
            this.regionAPI = regions_1.makeRegions(this.agent);
        }
        return this.regionAPI;
    }
    get solarSystems() {
        if (this.systemAPI === undefined) {
            this.systemAPI = solar_systems_1.makeSolarSystems(this.agent);
        }
        return this.systemAPI;
    }
    get stargates() {
        if (this.gateAPI === undefined) {
            this.gateAPI = stargates_1.makeStargates(this.agent);
        }
        return this.gateAPI;
    }
    get stations() {
        if (this.stationAPI === undefined) {
            this.stationAPI = stations_1.makeStations(this.agent);
        }
        return this.stationAPI;
    }
    get types() {
        if (this.typesAPI === undefined) {
            this.typesAPI = types_1.makeTypes(this.agent);
        }
        return this.typesAPI;
    }
    get wormholes() {
        if (this.whsAPI === undefined) {
            this.whsAPI = wormholes_1.makeWormholes(this.agent);
        }
        return this.whsAPI;
    }
    get alliances() {
        if (this.allyAPI === undefined) {
            this.allyAPI = alliances_1.makeAlliances(this.agent);
        }
        return this.allyAPI;
    }
    get corporations() {
        if (this.corpAPI === undefined) {
            this.corpAPI = corporations_1.makeCorporations(this.agent);
        }
        return this.corpAPI;
    }
    get incursions() {
        if (this.incursionAPI === undefined) {
            this.incursionAPI = incursions_1.makeIncursions(this.agent);
        }
        return this.incursionAPI;
    }
    get killmail() {
        if (this.kmAPI === undefined) {
            this.kmAPI = killmail_1.makeKillmail(this.agent);
        }
        return this.kmAPI;
    }
    get sovereignty() {
        if (this.sovAPI === undefined) {
            this.sovAPI = sovereignty_1.makeSovereignty(this.agent);
        }
        return this.sovAPI;
    }
    get wars() {
        if (this.warAPI === undefined) {
            this.warAPI = wars_1.makeWars(this.agent);
        }
        return this.warAPI;
    }
    search(text, strict) {
        const categories = [
            "agent" /* AGENT */,
            "alliance" /* ALLIANCE */,
            "character" /* CHARACTER */,
            "constellation" /* CONSTELLATION */,
            "corporation" /* CORPORATION */,
            "faction" /* FACTION */,
            "inventorytype" /* INVENTORYTYPE */,
            "region" /* REGION */,
            "solarsystem" /* SOLARSYSTEM */,
            "station" /* STATION */,
            "wormhole" /* WORMHOLE */
        ];
        return this.agent.request('get_search', {
            query: {
                'categories': categories, 'search': text, 'strict': strict || false
            }
        });
    }
    names(ids) {
        return names_1.getAllNames(this.agent, ids);
    }
    status() {
        return this.agent.request('get_status', undefined);
    }
}
//# sourceMappingURL=index.js.map