"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Create a new {@link Fittings} instance that uses the given character agent to
 * make its HTTP requests to the ESI interface.
 *
 * @param char The character access information
 * @returns An Fittings API instance
 */
function makeFittings(char) {
    let fittings = function (id) {
        if (id === undefined) {
            return char.agent.request('get_characters_character_id_fittings', { path: { character_id: char.id } }, char.ssoToken);
        }
        else {
            return new FittingImpl(char, fittings, id);
        }
    };
    fittings.add = function (fitting) {
        return char.agent.request('post_characters_character_id_fittings', { path: { character_id: char.id }, body: fitting }, char.ssoToken)
            .then(newID => newID.fitting_id);
    };
    return fittings;
}
exports.makeFittings = makeFittings;
class FittingImpl {
    constructor(char, fittings, id_) {
        this.char = char;
        this.fittings = fittings;
        this.id_ = id_;
    }
    del() {
        return this.char.agent.request('delete_characters_character_id_fittings_fitting_id', { path: { character_id: this.char.id, fitting_id: this.id_ } }, this.char.ssoToken);
    }
    id() {
        return Promise.resolve(this.id_);
    }
}
//# sourceMappingURL=fittings.js.map