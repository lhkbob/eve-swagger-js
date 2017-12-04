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
const r = require("../../internal/resource-api");
/**
 * An api adapter for accessing various details of a single corporation
 * starbase, specified by a provided id when the api is instantiated.
 */
class Starbase extends r.impl.SimpleResource {
    constructor(agent, id, systemID) {
        super(id);
        this.agent = agent;
        this.systemID = systemID;
    }
    /**
     * @returns The details of the specific starbase
     */
    details() {
        if (this.systemID !== undefined) {
            return getDetails(this.agent, this.id_, this.systemID);
        }
        else {
            // Must depend on summaries to get the system id as well
            return this.summaries()
                .then(summary => getDetails(this.agent, this.id_, summary.system_id));
        }
    }
    /**
     * @esi_route ~get_corporations_corporation_id_starbases
     *
     * @returns Summary and status of the specific starbase
     */
    summaries() {
        if (this.starbases_ === undefined) {
            this.starbases_ = getSummaries(this.agent);
        }
        return r.impl.filterIterated(this.starbases_(), this.id_, e => e.starbase_id);
    }
}
exports.Starbase = Starbase;
/**
 * An api adapter for accessing various details of multiple starbase ids,
 * specified by a provided an array or set of ids when the api is instantiated.
 */
class MappedStarbases extends r.impl.SimpleMappedResource {
    constructor(agent, ids) {
        super(ids);
        this.agent = agent;
    }
    /**
     * @returns Details of the starbases mapped by their id
     */
    details() {
        // First grab summaries and then load details
        return this.summaries().then(summaries => {
            let details = [];
            let ids = [];
            for (let s of summaries.values()) {
                ids.push(s.starbase_id);
                details.push(getDetails(this.agent, s.starbase_id, s.system_id));
            }
            return Promise.all(details).then(result => {
                let map = new Map();
                for (let i = 0; i < ids.length; i++) {
                    map.set(ids[i], result[i]);
                }
                return map;
            });
        });
    }
    /**
     * @esi_route ~get_corporations_corporation_id_starbases
     *
     * @returns Summary and status information for the set of starbases, mapped
     *     by their id
     */
    summaries() {
        if (this.starbases_ === undefined) {
            this.starbases_ = getSummaries(this.agent);
        }
        return this.arrayIDs()
            .then(ids => r.impl.filterIteratedToMap(this.starbases_(), ids, e => e.starbase_id));
    }
}
exports.MappedStarbases = MappedStarbases;
/**
 * An api adapter for accessing various details about every starbase of the
 * corporation.
 */
class IteratedStarbases extends r.impl.SimpleIteratedResource {
    constructor(agent) {
        super(getSummaries(agent), e => e.starbase_id);
        this.agent = agent;
    }
    /**
     * @returns Details for all of the corporation's starbases
     */
    details() {
        return __asyncGenerator(this, arguments, function* details_1() {
            try {
                // Iterate over the paginated resource directly since it provides the
                // mandatory system id as well
                for (var _a = __asyncValues(this.getPaginatedResource()), _b; _b = yield __await(_a.next()), !_b.done;) {
                    let [id, base] = yield __await(_b.value);
                    yield getDetails(this.agent, id, base.system_id)
                        .then(details => [
                        id, details
                    ]);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_b && !_b.done && (_c = _a.return)) yield __await(_c.call(_a));
                }
                finally { if (e_1) throw e_1.error; }
            }
            var e_1, _c;
        });
    }
    /**
     * @esi_route get_corporations_corporation_id_starbases
     *
     * @returns Summary and state information for the corporation's starbases
     */
    summaries() {
        return this.getPaginatedResource();
    }
}
exports.IteratedStarbases = IteratedStarbases;
/**
 * Create a new Starbases instance that uses the given `agent` to make its HTTP
 * requests to the ESI interface. The id of the `agent` refers to the
 * corporation id. The token of the `agent` must refer to a character that has
 * authorized the expected scopes and has the appropriate in-game roles for the
 * corporation.
 *
 * @param agent The agent making actual requests
 * @returns A Starbases instance
 */
function makeStarbases(agent) {
    return function (ids, systemID) {
        if (ids === undefined) {
            // No ID so return an iterated variant
            return new IteratedStarbases(agent);
        }
        else if (typeof ids === 'number') {
            // Single variant, with optional system ID
            return new Starbase(agent, ids, systemID);
        }
        else {
            // Multiple ids, so return a mapped variant
            return new MappedStarbases(agent, ids);
        }
    };
}
exports.makeStarbases = makeStarbases;
function getSummaries(agent) {
    return r.impl.makePageBasedStreamer(page => getSummaryPage(agent, page), 1000);
}
function getSummaryPage(agent, page) {
    return __awaiter(this, void 0, void 0, function* () {
        let corpID;
        if (typeof agent.id === 'number') {
            corpID = agent.id;
        }
        else {
            corpID = yield agent.id();
        }
        return agent.agent.request('get_corporations_corporation_id_starbases', { path: { corporation_id: corpID }, query: { page: page } }, agent.ssoToken).then(result => ({ result, maxPages: undefined }));
    });
}
function getDetails(agent, id, systemID) {
    return __awaiter(this, void 0, void 0, function* () {
        let corpID;
        if (typeof agent.id === 'number') {
            corpID = agent.id;
        }
        else {
            corpID = yield agent.id();
        }
        // NOTE: The swagger spec includes the page query parameter and has some
        // language talking about a list of POSes. However, the actual return type is
        // not an array so I think it's an error in the specification. Since page is
        // optional, we ignore it and don't expose it in the API.
        return agent.agent.request('get_corporations_corporation_id_starbases_starbase_id', {
            path: { corporation_id: corpID, starbase_id: id },
            query: { system_id: systemID }
        }, agent.ssoToken);
    });
}
//# sourceMappingURL=starbases.js.map