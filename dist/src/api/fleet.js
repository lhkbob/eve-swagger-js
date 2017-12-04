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
const r = require("../internal/resource-api");
const characters_1 = require("./character/characters");
const names_1 = require("../internal/names");
const batch_1 = require("../internal/batch");
/**
 * An api adapter for accessing various details of a single squad,
 * specified by a provided squad id when the api is instantiated.
 */
class Squad extends r.impl.SimpleResource {
    constructor(agent, squadID) {
        super(squadID);
        this.agent = agent;
    }
    /**
     * @returns A MappedMembers API that is dynamically linked to the members
     *     that are in the squad
     */
    get members() {
        if (this.members_ === undefined) {
            this.members_ = new MappedMembers(this.agent, () => getMembers(this.agent)
                .then(all => all.filter(e => e.squad_id === this.id_)
                .map(e => e.character_id)));
        }
        return this.members_;
    }
    /**
     * @esi_route ~get_fleets_fleet_id_wings
     *
     * @returns The details of the squad
     */
    details() {
        return getSquads(this.agent)
            .then(all => r.impl.filterArray(all, this.id_, e => e.id));
    }
    /**
     * Delete the squad.
     *
     * @esi_route delete_fleets_fleet_id_squads_squad_id
     *
     * @returns An empty promise that resolves when the delete finishes
     */
    del() {
        return deleteSquad(this.agent, this.id_);
    }
    /**
     * Rename the squad.
     *
     * @esi_route put_fleets_fleet_id_squads_squad_id
     *
     * @param name The squad's new name
     * @returns An empty promise that resolves when the update finishes
     */
    rename(name) {
        return updateSquad(this.agent, this.id_, { name: name });
    }
}
exports.Squad = Squad;
/**
 * An api adapter for accessing various details of a set of squads,
 * specified by provided squad ids when the api is instantiated.
 */
class MappedSquads extends r.impl.SimpleMappedResource {
    constructor(agent, ids) {
        super(ids);
        this.agent = agent;
    }
    /**
     * @esi_route ~get_fleets_fleet_id_wings
     *
     * @returns Details on each of the squads, mapped by squad id
     */
    details() {
        return this.arrayIDs()
            .then(ids => getSquads(this.agent)
            .then(all => r.impl.filterArrayToMap(all, ids, e => e.id)));
    }
    /**
     * Delete each of the specified squads.
     *
     * @esi_route delete_fleets_fleet_id_squads_squad_id
     *
     * @returns An empty promise that resolves when the specified squads are
     *     deleted
     */
    del() {
        return this.getResource(id => deleteSquad(this.agent, id))
            .then(map => undefined);
    }
    /**
     * Rename each of the specified squads to the same name.
     *
     * @esi_route put_fleets_fleet_id_squads_squad_id
     *
     * @param name The new name for each squad
     * @returns An empty promise that resolves when the specified squads are
     *     renamed
     */
    rename(name) {
        const naming = { name: name };
        return this.getResource(id => updateSquad(this.agent, id, naming))
            .then(map => undefined);
    }
}
exports.MappedSquads = MappedSquads;
/**
 * An api adapter for accessing various details about every squad in the
 * fleet.
 */
class IteratedSquads extends r.impl.SimpleIteratedResource {
    constructor(agent) {
        super(r.impl.makeArrayStreamer(() => getSquads(agent)), e => e.id);
        this.agent = agent;
    }
    /**
     * @returns An iterator over each of the squads in the fleet.
     */
    details() {
        return this.getPaginatedResource();
    }
}
exports.IteratedSquads = IteratedSquads;
/**
 * An api adapter for accessing various details of a single wing,
 * specified by a provided wing id when the api is instantiated.
 */
class Wing extends r.impl.SimpleResource {
    constructor(agent, wingID) {
        super(wingID);
        this.agent = agent;
    }
    /**
     * @returns A dynamic MappedSquads interface over the squads within this wing
     */
    get squads() {
        if (this.squads_ === undefined) {
            this.squads_ = new MappedSquads(this.agent, () => this.details().then(details => details.squads.map(e => e.id)));
        }
        return this.squads_;
    }
    /**
     * @returns A dynamic MappedMembers interface over the members in the wing
     */
    get members() {
        if (this.members_ === undefined) {
            this.members_ = new MappedMembers(this.agent, () => getMembers(this.agent)
                .then(members => members.filter(e => e.wing_id === this.id_)
                .map(e => e.character_id)));
        }
        return this.members_;
    }
    /**
     * @esi_route ~get_fleets_fleet_id_wings
     *
     * @returns The details of this wing
     */
    details() {
        return getWings(this.agent)
            .then(all => r.impl.filterArray(all, this.id_, e => e.id));
    }
    /**
     * Delete the wing.
     *
     * @esi_route delete_fleets_fleet_id_wings_wing_id
     *
     * @returns An empty promise that resolves when the delete has finished
     */
    del() {
        return deleteWing(this.agent, this.id_);
    }
    /**
     * Rename the wing.
     *
     * @esi_route put_fleets_fleet_id_wings_wing_id
     *
     * @param name The new name for the wing
     * @returns An empty promise that resolves when the update has finished
     */
    rename(name) {
        return updateWing(this.agent, this.id_, { name: name });
    }
}
exports.Wing = Wing;
/**
 * An api adapter for accessing various details of a set of wings,
 * specified by provided wing ids when the api is instantiated.
 */
class MappedWings extends r.impl.SimpleMappedResource {
    constructor(agent, ids) {
        super(ids);
        this.agent = agent;
    }
    /**
     * @returns Details of each of the wings, mapped by wing id
     */
    details() {
        return this.arrayIDs()
            .then(ids => getWings(this.agent)
            .then(all => r.impl.filterArrayToMap(all, ids, e => e.id)));
    }
    /**
     * Delete each of the wings.
     *
     * @esi_route delete_fleets_fleet_id_wings_wing_id
     *
     * @returns An empty promise that resolves when each of the wings has been
     *     deleted
     */
    del() {
        return this.getResource(id => deleteWing(this.agent, id))
            .then(map => undefined);
    }
    /**
     * Rename each of the wings to `name`.
     *
     * @esi_route put_fleets_fleet_id_wings_wing_id
     *
     * @param name The new name for each wing
     * @returns An empty promise that resolves when each of the wings has been
     *     renamed
     */
    rename(name) {
        const naming = { name: name };
        return this.getResource(id => updateWing(this.agent, id, naming))
            .then(map => undefined);
    }
}
exports.MappedWings = MappedWings;
/**
 * An api adapter for accessing various details about every wing in the
 * fleet.
 */
class IteratedWings extends r.impl.SimpleIteratedResource {
    constructor(agent) {
        super(r.impl.makeArrayStreamer(() => getWings(agent)), e => e.id);
        this.agent = agent;
    }
    /**
     * @returns An iterator over each of the wings in the fleet.
     */
    details() {
        return this.getPaginatedResource();
    }
}
exports.IteratedWings = IteratedWings;
/**
 * An api adapter for accessing various details of a single member,
 * specified by a provided member's character id when the api is instantiated.
 */
class Member extends r.impl.SimpleResource {
    constructor(agent, charID) {
        super(charID);
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
     * @esi_route ~get_fleets_fleet_id_members
     *
     * @returns The fleet role details of the member
     */
    roles() {
        return getMembers(this.agent)
            .then(all => r.impl.filterArray(all, this.id_, e => e.character_id));
    }
    /**
     * Kick the member from the fleet.
     *
     * @esi_route delete_fleets_fleet_id_members_member_id
     *
     * @returns An empty promise that resolves when the kick has been issued
     */
    kick() {
        return kickMember(this.agent, this.id_);
    }
    /**
     * Move the specific member to a new role or position in the fleet.
     *
     * @esi_route put_fleets_fleet_id_members_member_id
     *
     * @param moveOrder The details of the move
     * @returns An empty promise that resolves when the member has been moved
     */
    move(moveOrder) {
        return moveMember(this.agent, this.id_, moveOrder);
    }
    ;
}
exports.Member = Member;
/**
 * An api adapter for accessing various details of a set of members,
 * specified by provided member character ids when the api is instantiated.
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
     * @returns Fleet roles of each of the members, mapped by character id
     */
    roles() {
        return this.arrayIDs()
            .then(ids => getMembers(this.agent)
            .then(all => r.impl.filterArrayToMap(all, ids, e => e.character_id)));
    }
    /**
     * Kick each of the members.
     *
     * @esi_route delete_fleets_fleet_id_members_member_id
     *
     * @returns An empty promise that resolves when each of the members have been
     *     kicked
     */
    kick() {
        return this.getResource(id => kickMember(this.agent, id))
            .then(map => undefined);
    }
    /**
     * Move the members to a new role or position in the fleet. Since the same
     * move order is applied to every member in this set, the move order's
     * new role should be for squad member.
     *
     * @esi_route put_fleets_fleet_id_members_member_id
     *
     * @param moveOrder The details of the move
     * @returns An empty promise that resolves when the members have been moved
     */
    move(moveOrder) {
        return this.getResource(id => moveMember(this.agent, id, moveOrder))
            .then(map => undefined);
    }
    ;
}
exports.MappedMembers = MappedMembers;
/**
 * An api adapter for accessing various details about every member in the fleet.
 */
class IteratedMembers extends r.impl.SimpleIteratedResource {
    constructor(agent) {
        super(r.impl.makeArrayStreamer(() => getMembers(agent)), e => e.character_id);
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
     * @returns An iterator over each of the members' fleet details for the fleet.
     */
    roles() {
        return this.getPaginatedResource();
    }
}
exports.IteratedMembers = IteratedMembers;
function makeFleet(agent, type) {
    if (type === 'fleet') {
        // The SSOAgent's id refers to a fleet's id, and there's no character
        // specified
        return new FleetImpl(agent.agent, agent.ssoToken, undefined, agent.id);
    }
    else {
        // The SSOAgent's id refers to a character's id, so no need to provide a
        // fleet id
        return new FleetImpl(agent.agent, agent.ssoToken, agent.id, undefined);
    }
}
exports.makeFleet = makeFleet;
class FleetImpl {
    constructor(agent, ssoToken, charID, fleetID) {
        if (charID === undefined) {
            // No character, so assume the fleet ID is provided explicitly
            this.charAgent_ = undefined;
            this.agent = { agent, ssoToken, id: fleetID };
        }
        else {
            // Character provided, so ignore the fleetID and load it dynamically
            this.charAgent_ = { agent, ssoToken, id: charID };
            this.agent = {
                agent,
                ssoToken,
                id: () => getRole(this.charAgent_).then(role => role.fleet_id)
            };
        }
    }
    get wings() {
        if (this.wings_ === undefined) {
            this.wings_ = makeWings(this.agent);
        }
        return this.wings_;
    }
    get squads() {
        if (this.squads_ === undefined) {
            this.squads_ = makeSquads(this.agent);
        }
        return this.squads_;
    }
    get members() {
        if (this.members_ === undefined) {
            this.members_ = makeMembers(this.agent);
        }
        return this.members_;
    }
    ids() {
        if (typeof this.agent.id === 'number') {
            return Promise.resolve(this.agent.id);
        }
        else {
            return this.agent.id();
        }
    }
    role() {
        if (this.charAgent_ === undefined) {
            return Promise.reject('Not a CharacterFleet instance');
        }
        else {
            return getRole(this.charAgent_);
        }
    }
    details() {
        return getFleet(this.agent);
    }
    update(settings) {
        return updateFleet(this.agent, settings);
    }
    structure() {
        return getWings(this.agent);
    }
}
function makeSquads(agent) {
    let squads = function (ids) {
        if (ids === undefined) {
            // All squads of a fleet
            return new IteratedSquads(agent);
        }
        else if (typeof ids === 'number') {
            // Specific squad
            return new Squad(agent, ids);
        }
        else {
            // Set of squads
            return new MappedSquads(agent, ids);
        }
    };
    squads.add = function (wingID) {
        return addSquad(agent, wingID).then(id => id.squad_id);
    };
    return squads;
}
function makeWings(agent) {
    let wings = function (ids) {
        if (ids === undefined) {
            // All wings of a fleet
            return new IteratedWings(agent);
        }
        else if (typeof ids === 'number') {
            // Specific wing
            return new Wing(agent, ids);
        }
        else {
            // Set of wings
            return new MappedWings(agent, ids);
        }
    };
    wings.add = function () {
        return addWing(agent).then(id => id.wing_id);
    };
    return wings;
}
function makeMembers(agent) {
    let members = function (ids) {
        if (ids === undefined) {
            // All members of a fleet
            return new IteratedMembers(agent);
        }
        else if (typeof ids === 'number') {
            // Specific member
            return new Member(agent, ids);
        }
        else {
            // Set of members
            return new MappedMembers(agent, ids);
        }
    };
    members.invite = function (invitation) {
        return inviteMember(agent, invitation);
    };
    return members;
}
function getRole(agent) {
    return agent.agent.request('get_characters_character_id_fleet', { path: { character_id: agent.id } }, agent.ssoToken);
}
function getFleet(agent) {
    return __awaiter(this, void 0, void 0, function* () {
        let fleetID = typeof agent.id === 'number' ? agent.id
            : yield agent.id();
        return agent.agent.request('get_fleets_fleet_id', { path: { fleet_id: fleetID } }, agent.ssoToken);
    });
}
function updateFleet(agent, update) {
    return __awaiter(this, void 0, void 0, function* () {
        let fleetID = typeof agent.id === 'number' ? agent.id
            : yield agent.id();
        return agent.agent.request('put_fleets_fleet_id', { path: { fleet_id: fleetID }, body: update }, agent.ssoToken);
    });
}
function getMembers(agent) {
    return __awaiter(this, void 0, void 0, function* () {
        let fleetID = typeof agent.id === 'number' ? agent.id
            : yield agent.id();
        return agent.agent.request('get_fleets_fleet_id_members', { path: { fleet_id: fleetID } }, agent.ssoToken);
    });
}
function kickMember(agent, member) {
    return __awaiter(this, void 0, void 0, function* () {
        let fleetID = typeof agent.id === 'number' ? agent.id
            : yield agent.id();
        return agent.agent.request('delete_fleets_fleet_id_members_member_id', { path: { fleet_id: fleetID, member_id: member } }, agent.ssoToken);
    });
}
function moveMember(agent, member, move) {
    return __awaiter(this, void 0, void 0, function* () {
        let fleetID = typeof agent.id === 'number' ? agent.id
            : yield agent.id();
        return agent.agent.request('put_fleets_fleet_id_members_member_id', { path: { fleet_id: fleetID, member_id: member }, body: move }, agent.ssoToken);
    });
}
function inviteMember(agent, invitation) {
    return __awaiter(this, void 0, void 0, function* () {
        let fleetID = typeof agent.id === 'number' ? agent.id
            : yield agent.id();
        return agent.agent.request('post_fleets_fleet_id_members', { path: { fleet_id: fleetID }, body: invitation }, agent.ssoToken);
    });
}
function addWing(agent) {
    return __awaiter(this, void 0, void 0, function* () {
        let fleetID = typeof agent.id === 'number' ? agent.id
            : yield agent.id();
        return agent.agent.request('post_fleets_fleet_id_wings', { path: { fleet_id: fleetID } }, agent.ssoToken);
    });
}
function getWings(agent) {
    return __awaiter(this, void 0, void 0, function* () {
        let fleetID = typeof agent.id === 'number' ? agent.id
            : yield agent.id();
        return agent.agent.request('get_fleets_fleet_id_wings', { path: { fleet_id: fleetID } }, agent.ssoToken);
    });
}
function updateWing(agent, wing, update) {
    return __awaiter(this, void 0, void 0, function* () {
        let fleetID = typeof agent.id === 'number' ? agent.id
            : yield agent.id();
        return agent.agent.request('put_fleets_fleet_id_wings_wing_id', { path: { fleet_id: fleetID, wing_id: wing }, body: update }, agent.ssoToken);
    });
}
function deleteWing(agent, wing) {
    return __awaiter(this, void 0, void 0, function* () {
        let fleetID = typeof agent.id === 'number' ? agent.id
            : yield agent.id();
        return agent.agent.request('delete_fleets_fleet_id_wings_wing_id', { path: { fleet_id: fleetID, wing_id: wing } }, agent.ssoToken);
    });
}
function getSquads(agent) {
    return __awaiter(this, void 0, void 0, function* () {
        let wings = yield getWings(agent);
        let squads = [];
        for (let w of wings) {
            squads.push(...w.squads);
        }
        return squads;
    });
}
function addSquad(agent, wing) {
    return __awaiter(this, void 0, void 0, function* () {
        let fleetID = typeof agent.id === 'number' ? agent.id
            : yield agent.id();
        return agent.agent.request('post_fleets_fleet_id_wings_wing_id_squads', { path: { fleet_id: fleetID, wing_id: wing } }, agent.ssoToken);
    });
}
function updateSquad(agent, squad, update) {
    return __awaiter(this, void 0, void 0, function* () {
        let fleetID = typeof agent.id === 'number' ? agent.id
            : yield agent.id();
        return agent.agent.request('put_fleets_fleet_id_squads_squad_id', { path: { fleet_id: fleetID, squad_id: squad }, body: update }, agent.ssoToken);
    });
}
function deleteSquad(agent, squad) {
    return __awaiter(this, void 0, void 0, function* () {
        let fleetID = typeof agent.id === 'number' ? agent.id
            : yield agent.id();
        return agent.agent.request('delete_fleets_fleet_id_squads_squad_id', { path: { fleet_id: fleetID, squad_id: squad } }, agent.ssoToken);
    });
}
//# sourceMappingURL=fleet.js.map