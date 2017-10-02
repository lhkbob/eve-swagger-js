"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const page_loader_1 = require("../../internal/page-loader");
const search_1 = require("../../internal/search");
const character_corporation_1 = require("./character-corporation");
/**
 * Create a new {@link Structures} instance that uses the given character agent
 * to make its HTTP requests to the ESI interface.
 *
 * @param char The character access information
 * @returns An Mail API instance
 */
function makeStructures(char) {
    let structures = function (id) {
        return new StructureImpl(char, id);
    };
    structures.search = search_1.makeCharacterSearch(char.agent, "structure" /* STRUCTURE */, char.id, char.ssoToken);
    return structures;
}
exports.makeStructures = makeStructures;
class StructureImpl {
    constructor(agent, id_) {
        this.id_ = id_;
        this.agent = agent.agent;
        this.token = agent.ssoToken;
        this.corp = character_corporation_1.makeCharacterCorporation(agent);
        this.allOrders = page_loader_1.makePageBasedLoader(page => this.orders(page));
    }
    info() {
        return this.agent.request('get_universe_structures_structure_id', { path: { structure_id: this.id_ } }, this.token);
    }
    vulnerability(newSchedule) {
        return this.corp.id().then(corpID => {
            return this.agent.request('put_corporations_corporation_id_structures_structure_id', {
                path: { corporation_id: corpID, structure_id: this.id_ },
                body: newSchedule
            }, this.token);
        });
    }
    orders(page) {
        if (page === undefined) {
            return this.allOrders.getAll();
        }
        else {
            return this.agent.request('get_markets_structures_structure_id', { path: { structure_id: this.id_ }, query: { page } }, this.token);
        }
    }
    buyOrdersFor(typeId) {
        return this.ordersFor(typeId).then(typeOrders => {
            return typeOrders.filter(o => o.is_buy_order);
        });
    }
    sellOrdersFor(typeId) {
        return this.ordersFor(typeId).then(typeOrders => {
            return typeOrders.filter(o => !o.is_buy_order);
        });
    }
    ordersFor(typeId) {
        return this.orders().then(allOrders => {
            return allOrders.filter(o => o.type_id === typeId);
        });
    }
    id() {
        return Promise.resolve(this.id_);
    }
}
//# sourceMappingURL=structures.js.map