"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncIterator) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator];
    return m ? m.call(o) : typeof __values === "function" ? __values(o) : o[Symbol.iterator]();
};
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
const search_1 = require("../internal/search");
const r = require("../internal/resource-api");
/**
 * An api adapter for accessing various details of a single structure, specified
 * by a provided id when the api is instantiated. It must be provided with a
 * character id or a corporation id as well. When needed, it will infer the
 * other resource id based on information. For example, if a corp id is needed
 * for an ESI request but only the character id is available, then the
 * corporation of the character is used. If the character id is needed, then the
 * CEO of the corporation will be used.
 */
class Structure extends r.impl.SimpleResource {
    constructor(agent, ssoToken, id, charID, corpID) {
        super(id);
        this.agent = { agent, id, ssoToken };
        this.charAndCorp = new CharAndCorpAgent(agent, ssoToken, charID, corpID);
    }
    get market() {
        if (this.market_ === undefined) {
            this.market_ = new StructureMarket(this.agent);
        }
        return this.market_;
    }
    /**
     * @esi_route ~get_corporations_corporation_id_structures
     *
     * @returns More detailed information of the structure, including
     *     vulnerability periods and security
     */
    details() {
        if (this.details_ === undefined) {
            this.details_ = getCorpStructures(this.charAndCorp);
        }
        return r.impl.filterIterated(this.details_(), this.agent.id, e => e.structure_id);
    }
    /**
     * @returns The summary and name of the structure
     */
    summary() {
        return getStructure(this.agent);
    }
    /**
     * @esi_route ~get_universe_structures_structure_id
     *
     * @returns The name of the structure
     */
    names() {
        return this.summary().then(result => result.name);
    }
    /**
     * @param newSchedule The schedule specification
     * @returns An empty promise that resolves when the new schedule is saved
     */
    updateSchedule(newSchedule) {
        return __awaiter(this, void 0, void 0, function* () {
            let corp = yield this.charAndCorp.corpID();
            return this.agent.agent.request('put_corporations_corporation_id_structures_structure_id', {
                path: { corporation_id: corp, structure_id: this.agent.id },
                body: newSchedule
            }, this.agent.ssoToken);
        });
    }
}
exports.Structure = Structure;
/**
 * An api adapter for accessing various details of multiple structures,
 * specified by a provided an array, set of ids, or search query.
 */
class MappedStructures extends r.impl.SimpleMappedResource {
    constructor(agent, ssoToken, ids, charID, corpID) {
        super(ids);
        this.charAndCorp = new CharAndCorpAgent(agent, ssoToken, charID, corpID);
    }
    /**
     * @esi_route ~get_corporations_corporation_id_structures
     *
     * @returns More detailed information of the structures, including
     *     vulnerability periods and security, mapped by their id
     */
    details() {
        if (this.details_ === undefined) {
            this.details_ = getCorpStructures(this.charAndCorp);
        }
        return this.arrayIDs()
            .then(ids => r.impl.filterIteratedToMap(this.details_(), ids, e => e.structure_id));
    }
    /**
     * @returns The summary and name of the structures, mapped by id
     */
    summary() {
        return this.getResource(id => getStructure({
            agent: this.charAndCorp.agent, ssoToken: this.charAndCorp.ssoToken, id
        }));
    }
    /**
     * @esi_route ~get_universe_structures_structure_id
     *
     * @returns The name of the structures, mapped by id
     */
    names() {
        return this.getResource(id => getStructure({
            agent: this.charAndCorp.agent, ssoToken: this.charAndCorp.ssoToken, id
        }).then(details => details.name));
    }
}
exports.MappedStructures = MappedStructures;
/**
 * An api adapter for accessing various details of all structures owned by
 * a corporation (either specified directly, or the dynamic corporation of
 * a specific character).
 */
class IteratedStructures extends r.impl.SimpleIteratedResource {
    constructor(agent, ssoToken, charID, corpID) {
        let charAndCorp = new CharAndCorpAgent(agent, ssoToken, charID, corpID);
        super(getCorpStructures(charAndCorp), e => e.structure_id);
        this.charAndCorp = charAndCorp;
    }
    /**
     * @esi_route get_corporations_corporation_id_structures
     *
     * @returns More detailed information of the corp-owned structures, including
     *     vulnerability periods and security
     */
    details() {
        return this.getPaginatedResource();
    }
    /**
     * @returns The summary and name of each structure owned by the corp
     */
    summary() {
        return this.getResource(id => getStructure({
            agent: this.charAndCorp.agent, ssoToken: this.charAndCorp.ssoToken, id
        }));
    }
    /**
     * @esi_route ~get_universe_structures_structure_id
     *
     * @returns The name of each structure owned by the corporation
     */
    names() {
        return this.getResource(id => getStructure({
            agent: this.charAndCorp.agent, ssoToken: this.charAndCorp.ssoToken, id
        }).then(details => details.name));
    }
}
exports.IteratedStructures = IteratedStructures;
/**
 * Create a new {@link Structures} instance that uses the given character agent
 * to make its HTTP requests to the ESI interface.
 *
 * At least one of `charID` or `corpID` must be defined.
 *
 * @param agent The agent used to access information
 * @param ssoToken The authenticating token
 * @param charID The optional character ID used with certain requests, if not
 *     provided, the CEO of the corporation is used
 * @param corpID The optional corporation ID used with certain requests, if not
 *    provided, the character's corp is used
 * @returns An Mail API instance
 */
function makeStructures(agent, ssoToken, charID, corpID) {
    const charAndCorp = new CharAndCorpAgent(agent, ssoToken, charID, corpID);
    const structSearch = search_1.makeCharacterSearch(charAndCorp.charSSOAgent(), "structure" /* STRUCTURE */);
    return function (ids, strict = false) {
        if (ids === undefined) {
            // No argument
            return new IteratedStructures(agent, ssoToken, charID, corpID);
        }
        else if (typeof ids === 'number') {
            // Single id variant
            return new Structure(agent, ssoToken, ids, charID, corpID);
        }
        else if (typeof ids === 'string') {
            // Search variant that uses the IDSetProvider variant
            return new MappedStructures(agent, ssoToken, () => structSearch(ids, strict), charID, corpID);
        }
        else {
            // Either a set or an array
            return new MappedStructures(agent, ssoToken, ids, charID, corpID);
        }
    };
}
exports.makeStructures = makeStructures;
class CharAndCorpAgent {
    constructor(agent, ssoToken, charID_, corpID_) {
        this.agent = agent;
        this.ssoToken = ssoToken;
        this.charID_ = charID_;
        this.corpID_ = corpID_;
    }
    charSSOAgent() {
        if (typeof this.charID_ === 'number') {
            return { agent: this.agent, ssoToken: this.ssoToken, id: this.charID_ };
        }
        else {
            return {
                agent: this.agent, ssoToken: this.ssoToken, id: () => this.charID()
            };
        }
    }
    corpSSOAgent() {
        if (typeof this.corpID_ === 'number') {
            return { agent: this.agent, ssoToken: this.ssoToken, id: this.corpID_ };
        }
        else {
            return {
                agent: this.agent, ssoToken: this.ssoToken, id: () => this.corpID()
            };
        }
    }
    charID() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.charID_ === undefined) {
                // Must get it from corporation
                let corp = yield this.corpID();
                return this.agent.request('get_corporations_corporation_id', { path: { corporation_id: corp } }).then(details => details.ceo_id);
            }
            else if (typeof this.charID_ === 'number') {
                return Promise.resolve(this.charID_);
            }
            else {
                return this.charID_();
            }
        });
    }
    corpID() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.corpID_ === undefined) {
                // Must get it from the character
                let char = yield this.charID();
                return this.agent.request('get_characters_character_id', { path: { character_id: char } })
                    .then(details => details.corporation_id);
            }
            else if (typeof this.corpID_ === 'number') {
                return Promise.resolve(this.corpID_);
            }
            else {
                return this.corpID_();
            }
        });
    }
}
class StructureMarket {
    // Agent's ID corresponds to structure id, not a character or corporation
    constructor(agent) {
        this.agent = agent;
    }
    orders() {
        if (this.orders_ === undefined) {
            this.orders_ = r.impl.makePageBasedStreamer(page => this.getOrdersPage(page), 5000);
        }
        return this.orders_();
    }
    getOrdersPage(page) {
        return this.agent.agent.request('get_markets_structures_structure_id', { path: { structure_id: this.agent.id }, query: { page: page } }, this.agent.ssoToken).then(result => ({ result, maxPages: undefined }));
    }
    buyOrdersFor(typeID) {
        return this.getOrdersFor(typeID, 'buy');
    }
    sellOrdersFor(typeID) {
        return this.getOrdersFor(typeID, 'sell');
    }
    ordersFor(typeID) {
        return this.getOrdersFor(typeID, 'all');
    }
    getOrdersFor(typeID, orderType) {
        return __awaiter(this, void 0, void 0, function* () {
            let orders = [];
            try {
                for (var _a = __asyncValues(this.orders()), _b; _b = yield _a.next(), !_b.done;) {
                    let o = yield _b.value;
                    if (typeID === o.type_id && (orderType === 'all' || (orderType === 'buy'
                        && o.is_buy_order) || (orderType === 'sell'
                        && !o.is_buy_order))) {
                        // Order passes type id and order type filters
                        orders.push(o);
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_b && !_b.done && (_c = _a.return)) yield _c.call(_a);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return orders;
            var e_1, _c;
        });
    }
    types() {
        return __asyncGenerator(this, arguments, function* types_1() {
            let seen = new Set();
            try {
                for (var _a = __asyncValues(this.orders()), _b; _b = yield __await(_a.next()), !_b.done;) {
                    let o = yield __await(_b.value);
                    let typeID = o.type_id;
                    if (!seen.has(typeID)) {
                        seen.add(typeID);
                        yield typeID;
                    } // otherwise skip it
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_b && !_b.done && (_c = _a.return)) yield __await(_c.call(_a));
                }
                finally { if (e_2) throw e_2.error; }
            }
            var e_2, _c;
        });
    }
}
function getStructure(agent) {
    return agent.agent.request('get_universe_structures_structure_id', { path: { structure_id: agent.id } }, agent.ssoToken);
}
function getCorpStructures(agent) {
    return r.impl.makePageBasedStreamer(page => getCorpStructuresPage(agent, page), 250);
}
function getCorpStructuresPage(agent, page) {
    return __awaiter(this, void 0, void 0, function* () {
        let corpID = yield agent.corpID();
        return agent.agent.request('get_corporations_corporation_id_structures', { path: { corporation_id: corpID }, query: { page: page } }, agent.ssoToken).then(result => ({ result, maxPages: undefined }));
    });
}
//# sourceMappingURL=structures.js.map