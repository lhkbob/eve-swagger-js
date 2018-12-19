import { ESIAgent } from '../../internal/esi-agent';
import { Responses } from '../../../gen/esi';
/**
 * An api adapter that provides functions for accessing the
 * [insurance](https://esi.evetech.net/latest/#/Insurance) ESI end points.
 */
export interface Insurance {
    /**
     * @esi_example esi.insurance.prices()
     *
     * @return Insurance price levels
     */
    prices(): Promise<Responses['get_insurance_prices']>;
}
/**
 * Create a new {@link Insurance} instance that uses the given `agent` to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns A Insurance API instance
 */
export declare function makeInsurance(agent: ESIAgent): Insurance;
