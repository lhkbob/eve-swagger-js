"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const esi_agent_1 = require("./internal/esi-agent");
const names_1 = require("./internal/names");
const factions_1 = require("./api/factions");
const alliance_1 = require("./api/alliance");
const character_1 = require("./api/character");
const corporation_1 = require("./api/corporation");
const killmails_1 = require("./api/killmails");
const sovereignty_1 = require("./api/sovereignty");
const wars_1 = require("./api/wars");
const schema_1 = require("./api/schema");
const universe_1 = require("./api/universe");
const fleet_1 = require("./api/fleet");
__export(require("./error"));
/**
 * ESI creates a shared, internal agent and then lazily instantiates all
 * specific modules as needed. The internal agent maintains a single cache for
 * all of the requests to the network interface.
 *
 * The ESI instance also provides a function to create new API instances
 * with an updated configuration.
 *
 * @see https://esi.tech.ccp.is/latest
 */
class ESI {
    constructor(config = {}) {
        let fullConfig = Object.assign({}, exports.DEFAULT_CONFIG, config);
        this.agent = new esi_agent_1.ESIAgent(fullConfig);
    }
    get configuration() {
        return this.agent.configuration;
    }
    get alliances() {
        if (this.alliances_ === undefined) {
            this.alliances_ = alliance_1.makeAlliances(this.agent);
        }
        return this.alliances_;
    }
    get characters() {
        if (this.chars_ === undefined) {
            this.chars_ = character_1.makeCharacters(this.agent);
        }
        return this.chars_;
    }
    get corporations() {
        if (this.corps_ === undefined) {
            this.corps_ = corporation_1.makeCorporations(this.agent);
        }
        return this.corps_;
    }
    get wars() {
        if (this.wars_ === undefined) {
            this.wars_ = wars_1.makeWars(this.agent);
        }
        return this.wars_;
    }
    get factions() {
        if (this.factions_ === undefined) {
            this.factions_ = factions_1.makeFactions(this.agent);
        }
        return this.factions_;
    }
    get schema() {
        if (this.schema_ === undefined) {
            this.schema_ = new schema_1.Schema(this.agent);
        }
        return this.schema_;
    }
    get universe() {
        if (this.universe_ === undefined) {
            this.universe_ = new universe_1.Universe(this.agent);
        }
        return this.universe_;
    }
    get sovereignty() {
        if (this.sov_ === undefined) {
            this.sov_ = new sovereignty_1.Sovereignty(this.agent);
        }
        return this.sov_;
    }
    get killmails() {
        if (this.kms_ === undefined) {
            this.kms_ = killmails_1.makeKillmails(this.agent);
        }
        return this.kms_;
    }
    /**
     * Create a new ESI interface that uses the updated `config`. The provided
     * configuration is merged with this ESI's configuration, overriding this
     * instance's configuration with any keys specified in `config`.
     *
     * The newly created ESI instance uses its own internal agent with a separate
     * cache from this instance.
     *
     * If `config` is an empty object or not provided at all, the created ESI is a
     * new instance with the exact same configuration. Because the new instance
     * has its own cache, this can be a useful way to create multiple instances
     * that behave the same but are independent.
     *
     * @param config New configuration settings to override
     * @returns A new ESI instance
     */
    clone(config = {}) {
        let newConfig = Object.assign({}, this.configuration, config);
        return new ESI(newConfig);
    }
    /**
     * Create a new Fleet API associated with the specific `fleetID`. The `token`
     * must be an SSO authentication token for a character in the fleet. Depending
     * on the character's role within the fleet, certain features may be
     * inaccessible.
     *
     * @param fleetID The ID of the fleet
     * @param token The SSO token for a character in the fleet
     * @returns A Fleet API
     */
    fleet(fleetID, token) {
        return fleet_1.makeFleet({ agent: this.agent, ssoToken: token, id: fleetID }, 'fleet');
    }
    /**
     * @param text The text to search all entities and types for
     * @param strict Whether or not the search should be strict, defaults to false
     * @returns All matches and their corresponding categories
     */
    search(text, strict) {
        return this.agent.request('get_search', {
            query: {
                'categories': searchCategories,
                'search': text,
                'strict': strict || false
            }
        });
    }
    /**
     * If ids is longer than the reported maximum length for ESI, the array will
     * be split into smaller chunks and multiple requests will be made and then
     * concatenated back together.
     *
     * @param ids The ids to lookup
     * @returns The resolved names and detected categories
     */
    names(ids) {
        return names_1.getAllNames(this.agent, ids);
    }
    /**
     * @returns The status of the Eve servers
     */
    status() {
        return this.agent.request('get_status', undefined);
    }
}
exports.ESI = ESI;
/**
 * The default configuration that specifies values for parameters that aren't
 * explicitly given.
 */
exports.DEFAULT_CONFIG = {
    url: 'https://esi.tech.ccp.is',
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
const searchCategories = [
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
//# sourceMappingURL=index.js.map