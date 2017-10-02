"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const search_1 = require("../../internal/search");
const names_1 = require("../../internal/names");
const page_loader_1 = require("../../internal/page-loader");
/**
 * Create a new {@link Regions} instance that uses the given `agent` to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns An Regions API instance
 */
function makeRegions(agent) {
    let functor = function (id) {
        if (id === undefined) {
            return agent.request('get_universe_regions', undefined);
        }
        else {
            return new RegionImpl(agent, id);
        }
    };
    functor.search = search_1.makeDefaultSearch(agent, "region" /* REGION */);
    functor.names = function (ids) {
        if (ids === undefined) {
            return functor().then(allIds => functor.names(allIds));
        }
        else {
            return names_1.getNames(agent, "region" /* REGION */, ids);
        }
    };
    return functor;
}
exports.makeRegions = makeRegions;
class RegionImpl {
    constructor(agent, id_) {
        this.agent = agent;
        this.id_ = id_;
        this.allOrders = page_loader_1.makePageBasedLoader(page => this.orders(page));
    }
    info() {
        return this.agent.request('get_universe_regions_region_id', { path: { region_id: this.id_ } });
    }
    history(typeId) {
        return this.agent.request('get_markets_region_id_history', { path: { region_id: this.id_ }, query: { type_id: typeId } });
    }
    orders(page) {
        if (page === undefined) {
            return this.allOrders.getAll();
        }
        else {
            return this.agent.request('get_markets_region_id_orders', {
                path: { region_id: this.id_ },
                query: { page: page, order_type: 'all' }
            });
        }
    }
    buyOrdersFor(typeId) {
        return this.agent.request('get_markets_region_id_orders', {
            path: { region_id: this.id_ },
            query: { type_id: typeId, order_type: 'buy' }
        });
    }
    sellOrdersFor(typeId) {
        return this.agent.request('get_markets_region_id_orders', {
            path: { region_id: this.id_ },
            query: { type_id: typeId, order_type: 'sell' }
        });
    }
    ordersFor(typeId) {
        return this.agent.request('get_markets_region_id_orders', {
            path: { region_id: this.id_ },
            query: { type_id: typeId, order_type: 'all' }
        });
    }
    id() {
        return Promise.resolve(this.id_);
    }
}
//# sourceMappingURL=regions.js.map