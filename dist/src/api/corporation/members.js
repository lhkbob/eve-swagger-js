"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
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
const characters_1 = require("../character/characters");
const batch_1 = require("../../internal/batch");
const names_1 = require("../../internal/names");
/**
 * An api adapter for accessing various details of a single corporation
 * member, specified by a provided id when the api is instantiated.
 */
class Member extends r.impl.SimpleResource {
    constructor(agent, id) {
        super(id);
        this.agent = agent;
    }
    get base() {
        if (this.base_ === undefined) {
            this.base_ = new characters_1.Character(this.agent.agent, this.id_);
        }
        return this.base_;
    }
    /**
     * @returns The character details of the specific member
     */
    details() {
        return this.base.details();
    }
    /**
     * @returns The character portraits of the specific member
     */
    portraits() {
        return this.base.portraits();
    }
    /**
     * @returns The member's corporation history
     */
    history() {
        return this.base.history();
    }
    /**
     * @returns The member's affiliation information
     */
    affiliations() {
        return this.base.affiliations();
    }
    /**
     * @returns The member's character name
     */
    names() {
        return this.base.names();
    }
    /**
     * @esi_route ~get_corporations_corporation_id_membertracking
     *
     * @returns Online and login status for the specific member
     */
    tracking() {
        return getTracking(this.agent)
            .then(all => r.impl.filterArray(all, this.id_, e => e.character_id));
    }
    /**
     * @esi_route ~get_corporations_corporation_id_roles
     *
     * @returns The roles of the member
     */
    roles() {
        return getRoles(this.agent)
            .then(all => r.impl.filterArray(all, this.id_, e => e.character_id));
    }
    /**
     * @esi_route ~get_corporations_corporation_id_members_titles
     *
     * @returns The title ids that are assigned to the member
     */
    titles() {
        return getTitles(this.agent)
            .then(all => r.impl.filterArray(all, this.id_, e => e.character_id).titles);
    }
}
exports.Member = Member;
/**
 * An api adapter for accessing various details of multiple member ids,
 * specified by a provided an array or set of ids when the api is instantiated.
 */
class MappedMembers extends r.impl.SimpleMappedResource {
    constructor(agent, ids) {
        super(ids);
        this.agent = agent;
    }
    get base() {
        if (this.base_ === undefined) {
            this.base_ = new characters_1.MappedCharacters(this.agent.agent, this.ids_);
        }
        return this.base_;
    }
    /**
     * @returns The character details of the members, mapped by id
     */
    details() {
        return this.base.details();
    }
    /**
     * @returns The character portraits of the members, mapped by id
     */
    portraits() {
        return this.base.portraits();
    }
    /**
     * @returns The members' corporation histories, mapped by id
     */
    history() {
        return this.base.history();
    }
    /**
     * @returns The members' affiliations information, mapped by id
     */
    affiliations() {
        return this.base.affiliations();
    }
    /**
     * @returns The members' character names, mapped by id
     */
    names() {
        return this.base.names();
    }
    /**
     * @esi_route ~get_corporations_corporation_id_membertracking
     *
     * @returns Online and login status for the members, mapped by id
     */
    tracking() {
        return this.arrayIDs().then(ids => getTracking(this.agent)
            .then(all => r.impl.filterArrayToMap(all, ids, e => e.character_id)));
    }
    /**
     * @esi_route ~get_corporations_corporation_id_roles
     *
     * @returns The roles of the members, mapped by id
     */
    roles() {
        return this.arrayIDs().then(ids => getRoles(this.agent)
            .then(all => r.impl.filterArrayToMap(all, ids, e => e.character_id)));
    }
    /**
     * @esi_route ~get_corporations_corporation_id_members_titles
     *
     * @returns The title ids that are assigned to each member, mapped by id
     */
    titles() {
        return this.arrayIDs().then(ids => getTitles(this.agent)
            .then(all => r.impl.filterArrayToMap(all, ids, e => e.character_id))
            .then(map => {
            let remap = new Map();
            for (let [k, v] of map.entries()) {
                remap.set(k, v.titles);
            }
            return remap;
        }));
    }
}
exports.MappedMembers = MappedMembers;
/**
 * An api adapter for accessing various details about every member of the
 * corporation.
 */
class IteratedMembers extends r.impl.SimpleIteratedResource {
    constructor(agent) {
        super(r.impl.makeArrayStreamer(() => getMembersAsArray(agent)), e => e);
        this.agent = agent;
    }
    /**
     * @returns An iterator over the character details of the members
     */
    details() {
        return this.getResource(id => this.agent.agent.request('get_characters_character_id', { path: { character_id: id } }));
    }
    /**
     * @returns An iterator over the character portraits of the members
     */
    portraits() {
        return this.getResource(id => this.agent.agent.request('get_characters_character_id_portrait', { path: { character_id: id } }));
    }
    /**
     * @returns An iterator over the members' corporation histories
     */
    history() {
        return this.getResource(id => this.agent.agent.request('get_characters_character_id_corporationhistory', { path: { character_id: id } }));
    }
    /**
     * @esi_route post_characters_affiliation
     *
     * @returns An iterator over the members' affiliations information
     */
    affiliations() {
        return batch_1.getIteratedValues(this.ids(), idSet => this.agent.agent.request('post_characters_affiliation', { body: idSet }), e => [e.character_id, e], 1000);
    }
    /**
     * @esi_route post_universe_names [character]
     *
     * @returns An iterator over the members' character names
     */
    names() {
        return names_1.getIteratedNames(this.agent.agent, "character" /* CHARACTER */, this.ids());
    }
    /**
     * @esi_route get_corporations_corporation_id_roles
     *
     * @returns An iterator over the roles of each member
     */
    roles() {
        return __asyncGenerator(this, arguments, function* roles_1() {
            let roles = yield __await(getRoles(this.agent));
            for (let r of roles) {
                yield [r.character_id, r];
            }
        });
    }
    /**
     * @esi_route get_corporations_corporation_id_members_titles
     *
     * @returns An iterator over the title ids assigned to each member
     */
    titles() {
        return __asyncGenerator(this, arguments, function* titles_1() {
            let titles = yield __await(getTitles(this.agent));
            for (let t of titles) {
                yield [t.character_id, t.titles];
            }
        });
    }
    /**
     * @esi_route get_corporations_corporation_id_membertracking
     *
     * @returns An iterator over the login status and tracking details of every
     *     member
     */
    tracking() {
        return __asyncGenerator(this, arguments, function* tracking_1() {
            let tracking = yield __await(getTracking(this.agent));
            for (let t of tracking) {
                yield [t.character_id, t];
            }
        });
    }
}
exports.IteratedMembers = IteratedMembers;
/**
 * Create a new Members instance that uses the given `agent` to make its HTTP
 * requests to the ESI interface. The id of the `agent` refers to the
 * corporation id. The token of the `agent` must refer to a character that has
 * authorized the expected scopes and has the appropriate in-game roles for the
 * corporation.
 *
 * @param agent The agent making actual requests
 * @returns A Members instance
 */
function makeMembers(agent) {
    return function (ids) {
        if (ids === undefined) {
            // No ID so return an iterated variant
            return new IteratedMembers(agent);
        }
        else if (typeof ids === 'number') {
            // Single variant, with optional system ID
            return new Member(agent, ids);
        }
        else {
            // Multiple ids, so return a mapped variant
            return new MappedMembers(agent, ids);
        }
    };
}
exports.makeMembers = makeMembers;
function getMembersAsArray(agent) {
    return __awaiter(this, void 0, void 0, function* () {
        let corpID;
        if (typeof agent.id === 'number') {
            corpID = agent.id;
        }
        else {
            corpID = yield agent.id();
        }
        return agent.agent.request('get_corporations_corporation_id_members', {
            path: { corporation_id: corpID }
        }, agent.ssoToken).then(result => result.map(e => e.character_id));
    });
}
function getTitles(agent) {
    return __awaiter(this, void 0, void 0, function* () {
        let corpID;
        if (typeof agent.id === 'number') {
            corpID = agent.id;
        }
        else {
            corpID = yield agent.id();
        }
        return agent.agent.request('get_corporations_corporation_id_members_titles', {
            path: { corporation_id: corpID }
        }, agent.ssoToken);
    });
}
function getRoles(agent) {
    return __awaiter(this, void 0, void 0, function* () {
        let corpID;
        if (typeof agent.id === 'number') {
            corpID = agent.id;
        }
        else {
            corpID = yield agent.id();
        }
        return agent.agent.request('get_corporations_corporation_id_roles', {
            path: { corporation_id: corpID }
        }, agent.ssoToken);
    });
}
function getTracking(agent) {
    return __awaiter(this, void 0, void 0, function* () {
        let corpID;
        if (typeof agent.id === 'number') {
            corpID = agent.id;
        }
        else {
            corpID = yield agent.id();
        }
        return agent.agent.request('get_corporations_corporation_id_membertracking', {
            path: { corporation_id: corpID }
        }, agent.ssoToken);
    });
}
//# sourceMappingURL=members.js.map