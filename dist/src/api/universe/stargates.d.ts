import { ESIAgent } from '../../internal/esi-agent';
import { Responses } from '../../../gen/esi';
/**
 * An api adapter that provides functions for accessing various details for a
 * stargate specified by id, via functions in the
 * [universe](https://esi.evetech.net/latest/#/Universe) ESI endpoints.
 */
export interface Stargate {
    /**
     * @esi_example esi.stargates(id).info()
     *
     * @returns Details about the specific stargate
     */
    info(): Promise<Responses['get_universe_stargates_stargate_id']>;
    /**
     * @returns The stargate id
     */
    id(): Promise<number>;
}
/**
 * An api adapter that provides functions for accessing stargate information via
 * the [universe](https://esi.evetech.net/latest/#/Universe) ESI end points.
 */
export interface Stargates {
    /**
     * Create a new Stargate end point targeting the particular stargate
     * by `id`.
     *
     * @param id The stargate id
     * @returns A Stargate API wrapper
     */
    (id: number): Stargate;
}
/**
 * Create a new {@link Stargates} instance that uses the given `agent` to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns An Stargates API instance
 */
export declare function makeStargates(agent: ESIAgent): Stargates;
