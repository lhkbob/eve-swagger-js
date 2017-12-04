"use strict";
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);  }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const search_1 = require("../../internal/search");
const names_1 = require("../../internal/names");
const r = require("../../internal/resource-api");
/**
 * An api adapter for accessing various details of a single in-game type,
 * specified by a provided id when the api is instantiated.
 */
class Type extends r.impl.SimpleResource {
    constructor(agent, id) {
        super(id);
        this.agent = agent;
    }
    /**
     * @returns Information about the type
     */
    details() {
        return getDetails(this.agent, this.id_);
    }
    /**
     * @esi_route ~get_markets_prices
     *
     * @returns Price data for the type
     */
    prices() {
        return getPrices(this.agent)
            .then(all => r.impl.filterArray(all, this.id_, p => p.type_id));
    }
    /**
     * @esi_route ~get_universe_types_type_id
     *
     * @returns The name of the type
     */
    names() {
        return this.details().then(result => result.name);
    }
}
exports.Type = Type;
/**
 * An api adapter for accessing various details of multiple type ids,
 * specified by a provided an array or set of ids when the api is instantiated.
 */
class MappedTypes extends r.impl.SimpleMappedResource {
    constructor(agent, ids) {
        super(ids);
        this.agent = agent;
    }
    /**
     * @returns Type details mapped by type id
     */
    details() {
        return this.getResource(id => getDetails(this.agent, id));
    }
    /**
     * @esi_route ~get_markets_prices
     *
     * @returns Price data for each of the mapped types
     */
    prices() {
        return this.arrayIDs().then(ids => {
            return getPrices(this.agent)
                .then(all => r.impl.filterArrayToMap(all, ids, p => p.type_id));
        });
    }
    /**
     * @esi_route post_universe_names [type]
     *
     * @returns The names for each of the mapped types
     */
    names() {
        return this.arrayIDs()
            .then(ids => names_1.getNames(this.agent, "inventory_type" /* INVENTORY_TYPE */, ids));
    }
}
exports.MappedTypes = MappedTypes;
/**
 * An api adapter for accessing various details about every type in the game.
 */
class IteratedTypes extends r.impl.SimpleIteratedResource {
    constructor(agent) {
        super(r.impl.makePageBasedStreamer(page => agent.request('get_universe_types', { query: { page: page } })
            .then(result => ({ result, maxPages: undefined })), 1000), id => id);
        this.agent = agent;
    }
    /**
     * @returns Iterator over details of all in-game types
     */
    details() {
        return this.getResource(id => getDetails(this.agent, id));
    }
    /**
     * @esi_route get_markets_prices
     *
     * @returns An iterator over every price-able item type
     */
    prices() {
        return __asyncGenerator(this, arguments, function* prices_1() {
            let prices = yield __await(getPrices(this.agent));
            for (let p of prices) {
                yield [p.type_id, p];
            }
        });
    }
    /**
     * @esi_route post_universe_names [type]
     *
     * @returns Iterator over type names
     */
    names() {
        return names_1.getIteratedNames(this.agent, "inventory_type" /* INVENTORY_TYPE */, this.ids());
    }
}
exports.IteratedTypes = IteratedTypes;
/**
 * Create a new Types instance that uses the given `agent` to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns A Types instance
 */
function makeTypes(agent) {
    const typeSearch = search_1.makeDefaultSearch(agent, "inventorytype" /* INVENTORYTYPE */);
    return function (ids, strict = false) {
        if (ids === undefined) {
            // All types since no id
            return new IteratedTypes(agent);
        }
        else if (typeof ids === 'number') {
            // Single id so single API
            return new Type(agent, ids);
        }
        else if (typeof ids === 'string') {
            // Search query for mapped API
            return new MappedTypes(agent, () => typeSearch(ids, strict));
        }
        else {
            // Set or array, so mapped API
            return new MappedTypes(agent, ids);
        }
    };
}
exports.makeTypes = makeTypes;
function getDetails(agent, id) {
    return agent.request('get_universe_types_type_id', { path: { type_id: id } });
}
function getPrices(agent) {
    return agent.request('get_markets_prices', undefined);
}
//# sourceMappingURL=types.js.map