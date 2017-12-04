import { SSOAgent } from '../../internal/esi-agent';
import { esi } from '../../esi';
/**
 * An api adapter that provides functions for modifying the character's in-game
 * waypoints and destination via functions in the [user
 * interface](https://esi.tech.ccp.is/latest/#/User_Interface) ESI endpoints.
 */
export declare class Autopilot {
    private agent;
    constructor(agent: SSOAgent<number>);
    /**
     * Sets the destination for the character's autopilot, resetting any
     * previous waypoints.
     *
     * @esi_route post_ui_autopilot_waypoint
     *
     * @param id The new destination system id
     * @return An empty promise resolving when the request finishes
     */
    destination(id: number): Promise<undefined>;
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
    append(id: number): Promise<undefined>;
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
    prepend(id: number): Promise<undefined>;
    private waypoint(dest, clearWaypoints, prependWaypoint);
}
/**
 * An api adapter that provides functions for modifying the character's in-game
 * windows via functions in the [user
 * interface](https://esi.tech.ccp.is/latest/#/User_Interface) ESI endpoints.
 */
export declare class UI {
    private agent;
    private autopilot_?;
    constructor(agent: SSOAgent<number>);
    readonly autopilot: Autopilot;
    /**
     * @esi_route post_ui_openwindow_information
     *
     * @param id The target item or entity id to show in the window
     * @return An empty promise that resolves when the window is opened
     */
    info(id: number): Promise<undefined>;
    /**
     * @esi_route post_ui_openwindow_marketdetails
     *
     * @param id The market item's type id to display
     * @return An empty promise that resolves when the window is opened
     */
    market(id: number): Promise<undefined>;
    /**
     * @esi_route post_ui_openwindow_contract
     *
     * @param id The id of the contract
     * @return An empty promise that resolves when the window is opened
     */
    contract(id: number): Promise<undefined>;
    /**
     * @esi_route post_ui_openwindow_newmail
     *
     * @param settings Content specification for the new window
     * @return An empty promise that resolves when the window is opened
     */
    mail(settings: esi.character.mail.NewMailWindow): Promise<undefined>;
}
