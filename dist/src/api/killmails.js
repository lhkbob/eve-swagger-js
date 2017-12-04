"use strict";
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
const r = require("../internal/resource-api");
/**
 * An api adapter for accessing various details of a single killmail, specified
 * by a provided id and hash when the api is instantiated.
 */
class Killmail extends r.impl.SimpleResource {
    constructor(agent, id, hash) {
        super(id);
        this.agent = agent;
        this.hash = hash;
    }
    /**
     * @returns Details about this killmail
     */
    details() {
        return getDetails(this.agent, this.id_, this.hash);
    }
    /**
     * @returns The ID and hash link for this killmail
     */
    links() {
        return Promise.resolve({ killmail_id: this.id_, killmail_hash: this.hash });
    }
}
exports.Killmail = Killmail;
/**
 * An api adapter for accessing various details of multiple killmails, specified
 * by a provided an mapping of ids and hashes.
 */
class MappedKillmails extends r.impl.SimpleMappedResource {
    constructor(agent, idHashes) {
        super(Array.from(idHashes.keys()));
        this.agent = agent;
        this.idHashes = idHashes;
    }
    /**
     * @returns Details about all of the specified killmails
     */
    details() {
        let all = [];
        for (let pair of this.idHashes.entries()) {
            all.push(getDetails(this.agent, pair[0], pair[1]));
        }
        return Promise.all(all)
            .then(kills => {
            let map = new Map();
            for (let mail of kills) {
                map.set(mail.killmail_id, mail);
            }
            return map;
        });
    }
    /**
     * @returns ID and hash links for all specified killmails
     */
    links() {
        let map = new Map();
        for (let pair of this.idHashes) {
            map.set(pair[0], { killmail_id: pair[0], killmail_hash: pair[1] });
        }
        return Promise.resolve(map);
    }
}
exports.MappedKillmails = MappedKillmails;
/**
 * An api adapter for accessing various details about every killmail restricted
 * to some dynamic scope. This scope currently is either a character's,
 * corporation's or war's killmails from losses and final blows.
 *
 * The Killmails does not provide a way to create these instances
 * because it is instead the responsibility of each scope to provide an
 * IteratedKillmails instance accessing the appropriate mails.
 */
class IteratedKillmails extends r.impl.SimpleIteratedResource {
    constructor(agent, links) {
        super(links, link => link.killmail_id);
        this.agent = agent;
    }
    /**
     * @returns An asynchronous iterator over all killmails in the scope of this
     *    particular API instance
     */
    details() {
        return __asyncGenerator(this, arguments, function* details_1() {
            try {
                // Must stream over the links themselves and not just the ids since
                // the hash is required to get the details
                for (var _a = __asyncValues(this.streamer()), _b; _b = yield __await(_a.next()), !_b.done;) {
                    let link = yield __await(_b.value);
                    yield getDetails(this.agent, link.killmail_id, link.killmail_hash)
                        .then(mail => [link.killmail_id, mail]);
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
     * @returns An asynchronous iterator over all killmail links in the scope of
     *    this particular API instance
     */
    links() {
        return this.getPaginatedResource();
    }
}
exports.IteratedKillmails = IteratedKillmails;
/**
 * Create a new Killmails API that uses the given `agent` to make its
 * HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns A new Killmails
 */
function makeKillmails(agent) {
    return function (ids, hash) {
        if (typeof ids === 'number') {
            // Single killmail variant
            return new Killmail(agent, ids, hash);
        }
        else if (Array.isArray(ids)) {
            // Either a tuple or KillmailLink array so turn it into a map first
            let map = new Map();
            for (let e of ids) {
                if (e.killmail_id !== undefined) {
                    let link = e;
                    map.set(link.killmail_id, link.killmail_hash);
                }
                else {
                    let tuple = e;
                    map.set(tuple[0], tuple[1]);
                }
            }
            return new MappedKillmails(agent, map);
        }
        else {
            // A map so it can be used directly
            return new MappedKillmails(agent, ids);
        }
    };
}
exports.makeKillmails = makeKillmails;
function getDetails(agent, id, hash) {
    return agent.request('get_killmails_killmail_id_killmail_hash', { path: { killmail_id: id, killmail_hash: hash } });
}
//# sourceMappingURL=killmails.js.map