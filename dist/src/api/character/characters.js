"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const names_1 = require("../../internal/names");
const batch_1 = require("../../internal/batch");
const r = require("../../internal/resource-api");
/**
 * An api adapter that provides functions for viewing public (non-authenticated)
 * information about a specific character  via functions in the
 * [character](https://esi.tech.ccp.is/latest/#/Character) ESI endpoints.
 */
class Character extends r.impl.SimpleResource {
    constructor(agent, id) {
        super(id);
        this.agent = agent;
    }
    /**
     * @returns Public information about the specified character
     */
    details() {
        return getDetails(this.agent, this.id_);
    }
    /**
     * @returns Image URLs for the character's portrait
     */
    portraits() {
        return getPortrait(this.agent, this.id_);
    }
    /**
     * @returns The character's corporation history
     */
    history() {
        return getHistory(this.agent, this.id_);
    }
    /**
     * @esi_route ~get_characters_character_id
     *
     * @returns The character's corporation, and optionally alliance and faction
     *    affiliations
     */
    affiliations() {
        return this.details()
            .then(result => ({
            character_id: this.id_,
            faction_id: result.faction_id,
            alliance_id: result.alliance_id,
            corporation_id: result.corporation_id,
        }));
    }
    /**
     * @esi_route ~get_characters_character_id
     *
     * @returns The name of the character
     */
    names() {
        return this.details().then(result => result.name);
    }
}
exports.Character = Character;
/**
 * An api adapter for accessing various details of multiple characters,
 * specified by a provided an array, set of ids, or search query when the api is
 * instantiated.
 */
class MappedCharacters extends r.impl.SimpleMappedResource {
    constructor(agent, ids) {
        super(ids);
        this.agent = agent;
    }
    /**
     * @returns Details for the characters, mapped by their id
     */
    details() {
        return this.getResource(id => getDetails(this.agent, id));
    }
    /**
     * @returns Portrait URLs for the characters, mapped by their id
     */
    portraits() {
        return this.getResource(id => getPortrait(this.agent, id));
    }
    /**
     * @returns Corporation histories for the characters, mapped by their id
     */
    history() {
        return this.getResource(id => getHistory(this.agent, id));
    }
    /**
     * @esi_route post_characters_affiliation
     *
     * @returns Corporation, alliance, and faction affiliations for the
     *     characters, mapped by their id
     */
    affiliations() {
        return this.arrayIDs()
            .then(ids => batch_1.getBatchedValues(ids, idSet => this.agent.request('post_characters_affiliation', { body: idSet }), e => [e.character_id, e], 1000));
    }
    /**
     * @esi_route post_universe_names [character]
     * @esi_route get_characters_names
     *
     * @returns Character name mapped by their id
     */
    names() {
        return this.arrayIDs().then(ids => {
            if (ids.length > 100) {
                return names_1.getNames(this.agent, "character" /* CHARACTER */, ids);
            }
            else {
                return this.agent.request('get_characters_names', { query: { 'character_ids': ids } })
                    .then(results => {
                    let map = new Map();
                    for (let r of results) {
                        map.set(r.character_id, r.character_name);
                    }
                    return map;
                });
            }
        });
    }
}
exports.MappedCharacters = MappedCharacters;
function getDetails(agent, id) {
    return agent.request('get_characters_character_id', { path: { character_id: id } });
}
function getPortrait(agent, id) {
    return agent.request('get_characters_character_id_portrait', { path: { character_id: id } });
}
function getHistory(agent, id) {
    return agent.request('get_characters_character_id_corporationhistory', { path: { character_id: id } });
}
//# sourceMappingURL=characters.js.map