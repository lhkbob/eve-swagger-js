import { ESIAgent } from '../internal/esi-agent';
import { Responses } from '../../gen/esi';
/**
 * An api adapter that provides functions for accessing the
 * [sovereignty](https://esi.evetech.net/latest/#/Sovereignty) ESI end points.
 */
export interface Sovereignty {
    /**
     * @esi_example esi.sovereignty.campaigns()
     *
     * @return The current campaigns in Eve
     */
    campaigns(): Promise<Responses['get_sovereignty_campaigns']>;
    /**
     * @esi_example esi.sovereignty.structures()
     *
     * @return Details of the structures held in sovereignty
     */
    structures(): Promise<Responses['get_sovereignty_structures']>;
    /**
     * @esi_example esi.sovereignty.map()
     *
     * @return The details of the current sovereignty map
     */
    map(): Promise<Responses['get_sovereignty_map']>;
}
/**
 * Create a new {@link Sovereignty} instance that uses the given `agent` to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns A Sovereignty API instance
 */
export declare function makeSovereignty(agent: ESIAgent): Sovereignty;
