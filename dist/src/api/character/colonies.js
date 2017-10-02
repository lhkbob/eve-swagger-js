"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Create a new {@link Colonies} instance that uses the given character agent to
 * make its HTTP requests to the ESI interface.
 *
 * @param char The character access information
 * @returns An Colonies API instance
 */
function makeColonies(char) {
    return function (id) {
        if (id === undefined) {
            return char.agent.request('get_characters_character_id_planets', { path: { character_id: char.id } }, char.ssoToken);
        }
        else {
            return new ColonyImpl(char, id);
        }
    };
}
exports.makeColonies = makeColonies;
class ColonyImpl {
    constructor(char, id_) {
        this.char = char;
        this.id_ = id_;
    }
    layout() {
        return this.char.agent.request('get_characters_character_id_planets_planet_id', { path: { character_id: this.char.id, planet_id: this.id_ } }, this.char.ssoToken);
    }
    id() {
        return Promise.resolve(this.id_);
    }
}
//# sourceMappingURL=colonies.js.map