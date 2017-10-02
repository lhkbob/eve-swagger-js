"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const search_1 = require("../../internal/search");
const names_1 = require("../../internal/names");
const page_loader_1 = require("../../internal/page-loader");
/**
 * Create a new {@link Types} instance that uses the given `agent` to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns An Types API instance
 */
function makeTypes(agent) {
    const allTypes = page_loader_1.makePageBasedLoader(page => agent.request('get_universe_types', { query: { page: page } }));
    const allGroups = page_loader_1.makePageBasedLoader(page => agent.request('get_universe_groups', { query: { page: page } }));
    let types = function (id) {
        if (id === undefined) {
            return allTypes.getAll();
        }
        else {
            return new TypeImpl(agent, id);
        }
    };
    types.categories = function (id) {
        if (id === undefined) {
            return agent.request('get_universe_categories', undefined);
        }
        else {
            return new CategoryImpl(agent, id);
        }
    };
    types.marketGroups = function (id) {
        if (id === undefined) {
            return agent.request('get_markets_groups', undefined);
        }
        else {
            return new MarketGroupImpl(agent, id);
        }
    };
    types.groups = function (id) {
        if (id === undefined) {
            return allGroups.getAll();
        }
        else {
            return new GroupImpl(agent, id);
        }
    };
    types.search = search_1.makeDefaultSearch(agent, "inventorytype" /* INVENTORYTYPE */);
    types.prices = function () {
        return agent.request('get_markets_prices', undefined);
    };
    types.names = function (ids) {
        if (ids === undefined) {
            return types().then(allIds => types.names(allIds));
        }
        else {
            return names_1.getNames(agent, "inventory_type" /* INVENTORY_TYPE */, ids);
        }
    };
    return types;
}
exports.makeTypes = makeTypes;
class GroupImpl {
    constructor(agent, id_) {
        this.agent = agent;
        this.id_ = id_;
    }
    info() {
        return this.agent.request('get_universe_groups_group_id', { path: { group_id: this.id_ } });
    }
    id() {
        return Promise.resolve(this.id_);
    }
}
class MarketGroupImpl {
    constructor(agent, id_) {
        this.agent = agent;
        this.id_ = id_;
    }
    info() {
        return this.agent.request('get_markets_groups_market_group_id', { path: { market_group_id: this.id_ } });
    }
    id() {
        return Promise.resolve(this.id_);
    }
}
class CategoryImpl {
    constructor(agent, id_) {
        this.agent = agent;
        this.id_ = id_;
    }
    info() {
        return this.agent.request('get_universe_categories_category_id', { path: { category_id: this.id_ } });
    }
    id() {
        return Promise.resolve(this.id_);
    }
}
class TypeImpl {
    constructor(agent, id_) {
        this.agent = agent;
        this.id_ = id_;
    }
    info() {
        return this.agent.request('get_universe_types_type_id', { path: { type_id: this.id_ } });
    }
    id() {
        return Promise.resolve(this.id_);
    }
}
//# sourceMappingURL=types.js.map