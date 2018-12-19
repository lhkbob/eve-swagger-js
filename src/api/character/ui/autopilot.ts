import { ESIAgent } from '../../../internal/esi-agent';
import { Responses } from '../../../../gen/esi';

/**
 * An api adapter that provides functions for modifying the character's in-game
 * waypoints and destination via functions in the [user
 * interface](https://esi.evetech.net/latest/#/User_Interface) ESI endpoints.
 */
export interface Autopilot {
  /**
   * Sets the destination for the character's autopilot, resetting any
   * previous waypoints.
   *
   * @esi_example esi.characters(1, 'token').autopilot.destination(2)
   *
   * @param id The new destination system id
   * @return An empty promise resolving when the request finishes
   */
  destination(id: number): Promise<Responses['post_ui_autopilot_waypoint']>;

  /**
   * Adds the given system id to the waypoint list in the character's autopilot.
   * The system is added to the end of the waypoints, preserving any earlier
   * waypoints.
   *
   * @esi_example esi.characters(1, 'token').autopilot.append(2)
   *
   * @param id The system id to append to the list of waypoints
   * @return An empty promise resolving when the request finishes
   */
  append(id: number): Promise<Responses['post_ui_autopilot_waypoint']>;

  /**
   * Adds the given system id to the waypoint list in the character's autopilot.
   * The system is added to the front of the waypoints, preserving any later
   * waypoints.
   *
   * @esi_example esi.characters(1, 'token').autopilot.prepend(2)
   *
   * @param id The system id to prepend to the list of waypoints
   * @return An empty promise resolving when the request finishes
   */
  prepend(id: number): Promise<Responses['post_ui_autopilot_waypoint']>;
}

/**
 * Create a new {@link Autopilot} instance that uses the given `agent` to make
 * its HTTP requests to the ESI interface. The character whose UI is updated is
 * automatically determined from the token.
 *
 * @param agent The agent making actual requests
 * @param token The SSO token to authenticate requests
 * @returns An Autopilot API instance
 */
export function makeAutopilot(agent: ESIAgent, token: string): Autopilot {
  return new AutopilotImpl(agent, token);
}

class AutopilotImpl implements Autopilot {
  constructor(private agent: ESIAgent, private token: string) {
  }

  private waypoint(dest: number, clearWaypoints: boolean,
      prependWaypoint: boolean) {
    return this.agent.request('post_ui_autopilot_waypoint', {
      query: {
        destination_id: dest,
        clear_other_waypoints: clearWaypoints,
        add_to_beginning: prependWaypoint
      }
    }, this.token);
  }

  destination(id: number) {
    return this.waypoint(id, true, true);
  }

  append(id: number) {
    return this.waypoint(id, false, false);
  }

  prepend(id: number) {
    return this.waypoint(id, false, true);
  }
}
