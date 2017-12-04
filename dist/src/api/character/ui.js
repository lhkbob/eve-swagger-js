"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * An api adapter that provides functions for modifying the character's in-game
 * waypoints and destination via functions in the [user
 * interface](https://esi.tech.ccp.is/latest/#/User_Interface) ESI endpoints.
 */
class Autopilot {
    constructor(agent) {
        this.agent = agent;
    }
    /**
     * Sets the destination for the character's autopilot, resetting any
     * previous waypoints.
     *
     * @esi_route post_ui_autopilot_waypoint
     *
     * @param id The new destination system id
     * @return An empty promise resolving when the request finishes
     */
    destination(id) {
        return this.waypoint(id, true, true);
    }
    /**
     * Adds the given system id to the waypoint list in the character's autopilot.
     * The system is added to the end of the waypoints, preserving any earlier
     * waypoints.
     *
     * @esi_route post_ui_autopilot_waypoint
     *
     * @param id The system id to append to the list of waypoints
     * @return An empty promise resolving when the request finishes
     */
    append(id) {
        return this.waypoint(id, false, false);
    }
    /**
     * Adds the given system id to the waypoint list in the character's autopilot.
     * The system is added to the front of the waypoints, preserving any later
     * waypoints.
     *
     * @esi_route post_ui_autopilot_waypoint
     *
     * @param id The system id to prepend to the list of waypoints
     * @return An empty promise resolving when the request finishes
     */
    prepend(id) {
        return this.waypoint(id, false, true);
    }
    waypoint(dest, clearWaypoints, prependWaypoint) {
        return this.agent.agent.request('post_ui_autopilot_waypoint', {
            query: {
                destination_id: dest,
                clear_other_waypoints: clearWaypoints,
                add_to_beginning: prependWaypoint
            }
        }, this.agent.ssoToken);
    }
}
exports.Autopilot = Autopilot;
/**
 * An api adapter that provides functions for modifying the character's in-game
 * windows via functions in the [user
 * interface](https://esi.tech.ccp.is/latest/#/User_Interface) ESI endpoints.
 */
class UI {
    constructor(agent) {
        this.agent = agent;
    }
    get autopilot() {
        if (this.autopilot_ === undefined) {
            this.autopilot_ = new Autopilot(this.agent);
        }
        return this.autopilot_;
    }
    /**
     * @esi_route post_ui_openwindow_information
     *
     * @param id The target item or entity id to show in the window
     * @return An empty promise that resolves when the window is opened
     */
    info(id) {
        return this.agent.agent.request('post_ui_openwindow_information', { query: { target_id: id } }, this.agent.ssoToken);
    }
    /**
     * @esi_route post_ui_openwindow_marketdetails
     *
     * @param id The market item's type id to display
     * @return An empty promise that resolves when the window is opened
     */
    market(id) {
        return this.agent.agent.request('post_ui_openwindow_marketdetails', { query: { type_id: id } }, this.agent.ssoToken);
    }
    /**
     * @esi_route post_ui_openwindow_contract
     *
     * @param id The id of the contract
     * @return An empty promise that resolves when the window is opened
     */
    contract(id) {
        return this.agent.agent.request('post_ui_openwindow_contract', { query: { contract_id: id } }, this.agent.ssoToken);
    }
    /**
     * @esi_route post_ui_openwindow_newmail
     *
     * @param settings Content specification for the new window
     * @return An empty promise that resolves when the window is opened
     */
    mail(settings) {
        return this.agent.agent.request('post_ui_openwindow_newmail', { body: settings }, this.agent.ssoToken);
    }
}
exports.UI = UI;
//# sourceMappingURL=ui.js.map