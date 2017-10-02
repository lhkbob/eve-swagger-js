"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Create a new {@link Autopilot} instance that uses the given `agent` to make
 * its HTTP requests to the ESI interface. The character whose UI is updated is
 * automatically determined from the token.
 *
 * @param agent The agent making actual requests
 * @param token The SSO token to authenticate requests
 * @returns An Autopilot API instance
 */
function makeAutopilot(agent, token) {
    return new AutopilotImpl(agent, token);
}
exports.makeAutopilot = makeAutopilot;
class AutopilotImpl {
    constructor(agent, token) {
        this.agent = agent;
        this.token = token;
    }
    waypoint(dest, clearWaypoints, prependWaypoint) {
        return this.agent.request('post_ui_autopilot_waypoint', {
            query: {
                destination_id: dest,
                clear_other_waypoints: clearWaypoints,
                add_to_beginning: prependWaypoint
            }
        }, this.token);
    }
    destination(id) {
        return this.waypoint(id, true, true);
    }
    append(id) {
        return this.waypoint(id, false, false);
    }
    prepend(id) {
        return this.waypoint(id, false, true);
    }
}
//# sourceMappingURL=autopilot.js.map