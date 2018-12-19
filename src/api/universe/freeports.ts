import { ESIAgent } from '../../internal/esi-agent';
import { Responses } from '../../../gen/esi';

/**
 * An api adapter over the end points handling public structures via functions
 * in the [universe](https://esi.evetech.net/latest/#/Universe) ESI endpoints.
 */
export interface Freeports {
  /**
   * @esi_example esi.freeports()
   *
   * @returns List of structure IDs that are publicly accessible
   */
  () :Promise<Responses['get_universe_structures']>;
}

/**
 * Create a new {@link Freeports} instance that uses the given `agent` to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns A Freeports API instance
 */
export function makeFreeports(agent:ESIAgent) :Freeports {
  return <Freeports> <any> function() {
    return agent.request('get_universe_structures', undefined);
  };
}
