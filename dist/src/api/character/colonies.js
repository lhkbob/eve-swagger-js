"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const r = require("../../internal/resource-api");
/**
 * An api adapter for accessing various details of a single planetary colony,
 * specified by a provided planet id when the api is instantiated.
 */
class Colony extends r.impl.SimpleResource {
    constructor(agent, id) {
        super(id);
        this.agent = agent;
    }
    /**
     * @esi_route ~get_characters_character_id_planets
     *
     * @returns The colony summary for the specific planet id
     */
    summary() {
        return getColonies(this.agent)
            .then(all => r.impl.filterArray(all, this.id_, e => e.planet_id));
    }
    /**
     * @returns The colony factory configuration for the planet
     */
    details() {
        return getPlanet(this.agent, this.id_);
    }
}
exports.Colony = Colony;
/**
 * An api adapter for accessing various details of multiple colony ids,
 * specified by a provided an array or set of ids when the api is instantiated.
 */
class MappedColonies extends r.impl.SimpleMappedResource {
    constructor(agent, ids) {
        super(ids);
        this.agent = agent;
    }
    /**
     * @esi_route ~get_characters_character_id_planets
     *
     * @returns The colony summaries for the specified planets, mapped by id
     */
    summary() {
        return this.arrayIDs()
            .then(ids => getColonies(this.agent)
            .then(all => r.impl.filterArrayToMap(all, ids, e => e.planet_id)));
    }
    /**
     * @returns The colony factory configurations, mapped by id
     */
    details() {
        return this.getResource(id => getPlanet(this.agent, id));
    }
}
exports.MappedColonies = MappedColonies;
/**
 * An api adapter for accessing various details about every colony of the
 * character.
 */
class IteratedColonies extends r.impl.SimpleIteratedResource {
    constructor(agent) {
        super(r.impl.makeArrayStreamer(() => getColonies(agent)), e => e.planet_id);
        this.agent = agent;
    }
    /**
     * @esi_route get_characters_character_id_planets
     *
     * @returns The colony summaries for each of the character's PI planets
     */
    summary() {
        return this.getPaginatedResource();
    }
    /**
     * @returns The colony factory configurations for each of the PI colonies
     */
    details() {
        return this.getResource(id => getPlanet(this.agent, id));
    }
}
exports.IteratedColonies = IteratedColonies;
/**
 * Create a new {@link Colonies} instance that uses the given character agent to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The character access information
 * @returns An Colonies API instance
 */
function makeColonies(agent) {
    return function (ids) {
        if (ids === undefined) {
            // All colonies
            return new IteratedColonies(agent);
        }
        else if (typeof ids === 'number') {
            // Single colony
            return new Colony(agent, ids);
        }
        else {
            // Mapped colonies
            return new MappedColonies(agent, ids);
        }
    };
}
exports.makeColonies = makeColonies;
function getPlanet(agent, id) {
    return agent.agent.request('get_characters_character_id_planets_planet_id', { path: { character_id: agent.id, planet_id: id } }, agent.ssoToken);
}
function getColonies(agent) {
    return agent.agent.request('get_characters_character_id_planets', { path: { character_id: agent.id } }, agent.ssoToken);
}
//# sourceMappingURL=colonies.js.map