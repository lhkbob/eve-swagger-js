import { ESIAgent } from '../internal/esi-agent';
import { Responses } from '../../gen/esi';
/**
 * An api adapter over the end points handling incursions  via functions in the
 * [incursions](https://esi.evetech.net/latest/#/Incursions) ESI endpoints.
 */
export interface Incursions {
    /**
     * @esi_example esi.incursions()
     *
     * @return Information on all active incursions
     */
    (): Promise<Responses['get_incursions']>;
}
/**
 * Create a new {@link Incursions} instance that uses the given `agent` to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns An Incursions API instance
 */
export declare function makeIncursions(agent: ESIAgent): Incursions;
