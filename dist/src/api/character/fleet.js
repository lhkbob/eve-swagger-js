"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Create a new {@link Fleet} instance that uses the given fleet agent to
 * make its HTTP requests to the ESI interface.
 *
 * @param fleet The fleet access information
 * @returns An Fleet API instance
 */
function makeFleet(fleet) {
    return new FleetImpl(fleet);
}
exports.makeFleet = makeFleet;
class SquadImpl {
    constructor(fleet_, wingID, squadID) {
        this.fleet_ = fleet_;
        this.wingID = wingID;
        this.squadID = squadID;
    }
    rename(name) {
        return this.fleet_.agent.request('put_fleets_fleet_id_squads_squad_id', {
            path: { fleet_id: this.fleet_.id, squad_id: this.squadID },
            body: { name }
        }, this.fleet_.ssoToken);
    }
    del() {
        return this.fleet_.agent.request('delete_fleets_fleet_id_squads_squad_id', { path: { fleet_id: this.fleet_.id, squad_id: this.squadID } }, this.fleet_.ssoToken);
    }
    id() {
        return Promise.resolve(this.squadID);
    }
    wing() {
        return Promise.resolve(this.wingID);
    }
    fleet() {
        return Promise.resolve(this.fleet_.id);
    }
}
function makeSquads(fleet, wingID) {
    let squads = function (id) {
        return new SquadImpl(fleet, wingID, id);
    };
    squads.add = function () {
        return fleet.agent.request('post_fleets_fleet_id_wings_wing_id_squads', { path: { fleet_id: fleet.id, wing_id: wingID } }, fleet.ssoToken)
            .then(result => result.squad_id);
    };
    squads.wing = function () {
        return Promise.resolve(wingID);
    };
    squads.fleet = function () {
        return Promise.resolve(fleet.id);
    };
    return squads;
}
class WingImpl {
    constructor(fleet_, wingID) {
        this.fleet_ = fleet_;
        this.wingID = wingID;
    }
    get squads() {
        if (this.squads_ === undefined) {
            this.squads_ = makeSquads(this.fleet_, this.wingID);
        }
        return this.squads_;
    }
    rename(name) {
        return this.fleet_.agent.request('put_fleets_fleet_id_wings_wing_id', {
            path: { fleet_id: this.fleet_.id, wing_id: this.wingID },
            body: { name }
        }, this.fleet_.ssoToken);
    }
    del() {
        return this.fleet_.agent.request('delete_fleets_fleet_id_wings_wing_id', { path: { fleet_id: this.fleet_.id, wing_id: this.wingID } }, this.fleet_.ssoToken);
    }
    id() {
        return Promise.resolve(this.wingID);
    }
    fleet() {
        return Promise.resolve(this.fleet_.id);
    }
}
function makeWings(fleet) {
    let wings = function (id) {
        if (id === undefined) {
            return fleet.agent.request('get_fleets_fleet_id_wings', { path: { fleet_id: fleet.id } }, fleet.ssoToken);
        }
        else {
            return new WingImpl(fleet, id);
        }
    };
    wings.add = function () {
        return fleet.agent.request('post_fleets_fleet_id_wings', { path: { fleet_id: fleet.id } }, fleet.ssoToken)
            .then(result => result.wing_id);
    };
    wings.fleet = function () {
        return Promise.resolve(fleet.id);
    };
    return wings;
}
class FleetImpl {
    constructor(fleet) {
        this.fleet = fleet;
    }
    get wings() {
        if (this.wings_ === undefined) {
            this.wings_ = makeWings(this.fleet);
        }
        return this.wings_;
    }
    info() {
        return this.fleet.agent.request('get_fleets_fleet_id', { path: { fleet_id: this.fleet.id } }, this.fleet.ssoToken);
    }
    members() {
        return this.fleet.agent.request('get_fleets_fleet_id_members', { path: { fleet_id: this.fleet.id } }, this.fleet.ssoToken);
    }
    invite(invitation) {
        return this.fleet.agent.request('post_fleets_fleet_id_members', { path: { fleet_id: this.fleet.id }, body: invitation }, this.fleet.ssoToken);
    }
    kick(memberID) {
        return this.fleet.agent.request('delete_fleets_fleet_id_members_member_id', { path: { fleet_id: this.fleet.id, member_id: memberID } }, this.fleet.ssoToken);
    }
    move(memberID, moveOrder) {
        return this.fleet.agent.request('put_fleets_fleet_id_members_member_id', {
            path: { fleet_id: this.fleet.id, member_id: memberID },
            body: moveOrder
        }, this.fleet.ssoToken);
    }
    update(settings) {
        return this.fleet.agent.request('put_fleets_fleet_id', { path: { fleet_id: this.fleet.id }, body: settings }, this.fleet.ssoToken);
    }
}
//# sourceMappingURL=fleet.js.map