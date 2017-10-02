"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const page_loader_1 = require("../../internal/page-loader");
const corporations_1 = require("../corporations");
/**
 * Create a new {@link CharacterCorporation} instance that uses the given
 * `char` to make its HTTP requests to the ESI interface.
 *
 * @param char The character information for making actual requests
 * @returns An CharacterCorporation API instance
 */
function makeCharacterCorporation(char) {
    return new CharacterCorporationImpl(char);
}
exports.makeCharacterCorporation = makeCharacterCorporation;
class CharacterCorporationImpl {
    constructor(char) {
        this.char = char;
        this.allStructs = page_loader_1.makePageBasedLoader(page => this.structures(page), 250);
    }
    info() {
        return this.base().then(c => c.info());
    }
    history() {
        return this.base().then(c => c.history());
    }
    icon() {
        return this.base().then(c => c.icon());
    }
    loyaltyOffers() {
        return this.base().then(c => c.loyaltyOffers());
    }
    members() {
        return this.id().then(corpId => {
            return this.char.agent.request('get_corporations_corporation_id_members', { path: { corporation_id: corpId } }, this.char.ssoToken);
        }).then(result => {
            return result.map(e => e.character_id);
        });
    }
    roles() {
        return this.id().then(corpId => {
            return this.char.agent.request('get_corporations_corporation_id_roles', { path: { corporation_id: corpId } }, this.char.ssoToken);
        });
    }
    structures(page) {
        if (page === undefined) {
            return this.allStructs.getAll();
        }
        else {
            return this.id().then(corpId => {
                return this.char.agent.request('get_corporations_corporation_id_structures', { path: { corporation_id: corpId }, query: { page } }, this.char.ssoToken);
            });
        }
    }
    base() {
        if (this.corp !== undefined) {
            return Promise.resolve(this.corp);
        }
        else {
            return this.char.agent.request('get_characters_character_id', { path: { character_id: this.char.id } }).then(result => {
                this.corp = corporations_1.makeCorporation(this.char.agent, result.corporation_id);
                return this.corp;
            });
        }
    }
    id() {
        return this.base().then(c => c.id());
    }
}
//# sourceMappingURL=character-corporation.js.map