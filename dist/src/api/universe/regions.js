"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const search_1 = require("../../internal/search");
const names_1 = require("../../internal/names");
const r = require("../../internal/resource-api");
const constellations_1 = require("./constellations");
/**
 * An api adapter for accessing various details of a single in-game region,
 * specified by a provided id when the api is instantiated.
 */
class Region extends r.impl.SimpleResource {
    constructor(agent, id) {
        super(id);
        this.agent = agent;
    }
    /**
     * @returns A MappedConstellations instance tied to the constellations
     *    referenced by the details of this region
     */
    get constellations() {
        if (this.constellations_ === undefined) {
            this.constellations_ = new constellations_1.MappedConstellations(this.agent, () => this.details().then(r => r.constellations));
        }
        return this.constellations_;
    }
    /**
     * @esi_route orders get_markets_region_id_orders [all]
     * @esi_route buyOrdersFor get_markets_region_id_orders [type, buy]
     * @esi_route sellOrdersFor get_markets_region_id_orders [type, sell]
     * @esi_route ordersFor get_markets_region_id_orders [type]
     * @esi_route types get_markets_region_id_types
     * @esi_route history get_markets_region_id_history
     *
     * @returns An API for accessing the region's market
     */
    get market() {
        if (this.market_ === undefined) {
            this.market_ = new RegionMarket(this.agent, this.id_);
        }
        return this.market_;
    }
    /**
     * @returns Information about the region
     */
    details() {
        return getDetails(this.agent, this.id_);
    }
    /**
     * @esi_route ~get_universe_regions_region_id
     *
     * @returns The name of the region
     */
    names() {
        return this.details().then(result => result.name);
    }
}
exports.Region = Region;
/**
 * An api adapter for accessing various details of multiple region ids,
 * specified by a provided an array or set of ids when the api is instantiated.
 */
class MappedRegions extends r.impl.SimpleMappedResource {
    constructor(agent, ids) {
        super(ids);
        this.agent = agent;
    }
    /**
     * @returns Region details mapped by region id
     */
    details() {
        return this.getResource(id => getDetails(this.agent, id));
    }
    /**
     * @esi_route post_universe_names [region]
     *
     * @returns The names for each of the mapped regions
     */
    names() {
        return this.arrayIDs()
            .then(ids => names_1.getNames(this.agent, "constellation" /* CONSTELLATION */, ids));
    }
}
exports.MappedRegions = MappedRegions;
/**
 * An api adapter for accessing various details about every region in
 * the game.
 */
class IteratedRegions extends r.impl.SimpleIteratedResource {
    constructor(agent) {
        super(r.impl.makeArrayStreamer(() => agent.request('get_universe_regions', undefined)), id => id);
        this.agent = agent;
    }
    /**
     * @returns Iterator over details of all in-game regions
     */
    details() {
        return this.getResource(id => getDetails(this.agent, id));
    }
    /**
     * @esi_route post_universe_names [region]
     *
     * @returns Iterator over region names
     */
    names() {
        return names_1.getIteratedNames(this.agent, "region" /* REGION */, this.ids());
    }
}
exports.IteratedRegions = IteratedRegions;
/**
 * Create a new Regions instance that uses the given `agent` to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns A Regions instance
 */
function makeRegions(agent) {
    const regionSearch = search_1.makeDefaultSearch(agent, "region" /* REGION */);
    return function (ids, strict = false) {
        if (ids === undefined) {
            // All regions since no id
            return new IteratedRegions(agent);
        }
        else if (typeof ids === 'number') {
            // Single id so single API
            return new Region(agent, ids);
        }
        else if (typeof ids === 'string') {
            // Search query for mapped API
            return new MappedRegions(agent, () => regionSearch(ids, strict));
        }
        else {
            // Set or array, so mapped API
            return new MappedRegions(agent, ids);
        }
    };
}
exports.makeRegions = makeRegions;
function getDetails(agent, id) {
    return agent.request('get_universe_regions_region_id', { path: { region_id: id } });
}
class RegionMarket {
    constructor(agent, id) {
        this.agent = agent;
        this.id = id;
    }
    orders() {
        if (this.orders_ === undefined) {
            this.orders_ = r.impl.makePageBasedStreamer(page => this.agent.request('get_markets_region_id_orders', {
                path: { region_id: this.id },
                query: { page: page, order_type: 'all' }
            })
                .then(result => ({ result, maxPages: undefined })), 10000);
        }
        return this.orders_();
    }
    buyOrdersFor(type) {
        return this.agent.request('get_markets_region_id_orders', {
            path: { region_id: this.id }, query: { type_id: type, order_type: 'buy' }
        });
    }
    sellOrdersFor(type) {
        return this.agent.request('get_markets_region_id_orders', {
            path: { region_id: this.id }, query: { type_id: type, order_type: 'sell' }
        });
    }
    ordersFor(type) {
        return this.agent.request('get_markets_region_id_orders', {
            path: { region_id: this.id }, query: { type_id: type, order_type: 'all' }
        });
    }
    types() {
        if (this.types_ === undefined) {
            this.types_ = r.impl.makePageBasedStreamer(page => this.agent.request('get_markets_region_id_types', { path: { region_id: this.id }, query: { page: page } })
                .then(result => ({ result, maxPages: undefined })), 1000);
        }
        return this.types_();
    }
    history(type) {
        return this.agent.request('get_markets_region_id_history', { path: { region_id: this.id }, query: { type_id: type } });
    }
}
//# sourceMappingURL=regions.js.map