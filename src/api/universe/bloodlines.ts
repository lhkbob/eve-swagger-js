import { ESIAgent } from '../../internal/esi-agent';
import { Responses } from '../../../gen/esi';

/**
 * An api adapter over the end points handling bloodlines via functions in the
 * [universe](https://esi.evetech.net/latest/#/Universe) ESI endpoints.
 */
export interface Bloodlines {
  /**
   * @esi_example esi.bloodlines()
   *
   * @returns Information on all the bloodlines defined in Eve
   */
  () :Promise<Responses['get_universe_bloodlines']>;
}

/**
 * Create a new {@link Bloodlines} instance that uses the given `agent` to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns An Bloodlines API instance
 */
export function makeBloodlines(agent: ESIAgent) :Bloodlines {
  return function() {
    return agent.request('get_universe_bloodlines', undefined);
  }
}
