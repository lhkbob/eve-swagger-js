"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const names_1 = require("../../internal/names");
const r = require("../../internal/resource-api");
/**
 * An api adapter for accessing various details of a single corporation,
 * specified by a provided id when the api is instantiated.
 */
class Corporation {
    constructor(agent, id) {
        this.agent = agent;
        this.id = id;
    }
    /**
     * @returns The public info of the corporation
     */
    details() {
        return __awaiter(this, void 0, void 0, function* () {
            return getDetails(this.agent, yield this.ids());
        });
    }
    /**
     * @returns The alliance history of the corporation
     */
    history() {
        return __awaiter(this, void 0, void 0, function* () {
            return getHistory(this.agent, yield this.ids());
        });
    }
    /**
     * @returns URL lookup information for the corporation icon images
     */
    icons() {
        return __awaiter(this, void 0, void 0, function* () {
            return getIcons(this.agent, yield this.ids());
        });
    }
    /**
     * @returns Loyalty offers available for the NPC corporation
     */
    loyaltyOffers() {
        return __awaiter(this, void 0, void 0, function* () {
            return getLoyaltyOffers(this.agent, yield this.ids());
        });
    }
    /**
     * @esi_route ~get_corporations_corporation_id
     *
     * @returns The name of the corporation
     */
    names() {
        return this.details().then(result => result.corporation_name);
    }
    ids() {
        if (typeof this.id === 'number') {
            return Promise.resolve(this.id);
        }
        else {
            return this.id();
        }
    }
}
exports.Corporation = Corporation;
/**
 * An api adapter for accessing various details of multiple corporations,
 * specified by a provided an array, set of ids, search query, or NPC
 * corporations when the api is instantiated.
 */
class MappedCorporations extends r.impl.SimpleMappedResource {
    constructor(agent, ids) {
        super(ids);
        this.agent = agent;
    }
    /**
     * @returns The public details of the corporations, mapped by their id
     */
    details() {
        return this.getResource(id => getDetails(this.agent, id));
    }
    /**
     * @returns The alliance history of the corporations, mapped by their id
     */
    history() {
        return this.getResource(id => getHistory(this.agent, id));
    }
    /**
     * @returns The icons of the corporations, mapped by their id
     */
    icons() {
        return this.getResource(id => getIcons(this.agent, id));
    }
    /**
     * @returns The loyalty offers for the corporations, mapped by their id
     */
    loyaltyOffers() {
        return this.getResource(id => getLoyaltyOffers(this.agent, id));
    }
    /**
     * @esi_route post_universe_names [corporation]
     * @esi_route get_corporations_names
     *
     * @returns Map from corporation id to their name
     */
    names() {
        return this.arrayIDs().then(ids => {
            if (ids.length > 100) {
                return names_1.getNames(this.agent, "corporation" /* CORPORATION */, ids);
            }
            else {
                return this.agent.request('get_corporations_names', { query: { 'corporation_ids': ids } })
                    .then(results => {
                    let map = new Map();
                    for (let r of results) {
                        map.set(r.corporation_id, r.corporation_name);
                    }
                    return map;
                });
            }
        });
    }
}
exports.MappedCorporations = MappedCorporations;
function getDetails(agent, id) {
    return agent.request('get_corporations_corporation_id', { path: { corporation_id: id } });
}
function getHistory(agent, id) {
    return agent.request('get_corporations_corporation_id_alliancehistory', { path: { corporation_id: id } });
}
function getIcons(agent, id) {
    return agent.request('get_corporations_corporation_id_icons', { path: { corporation_id: id } });
}
function getLoyaltyOffers(agent, id) {
    return agent.request('get_loyalty_stores_corporation_id_offers', { path: { corporation_id: id } });
}
//# sourceMappingURL=corporations.js.map