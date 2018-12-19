import { ESIAgent } from '../../internal/esi-agent';
import { Responses } from '../../../gen/esi';

/**
 * An api adapter over the end points handling races via functions in the
 * [universe](https://esi.evetech.net/latest/#/Universe) ESI endpoints.
 */
export interface Races {
  /**
   * @esi_example esi.races()
   *
   * @returns Information on all races
   */
  (): Promise<Responses['get_universe_races']>;
}

/**
 * Create a new {@link Race} instance that uses the given `agent` to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns An Races API instance
 */
export function makeRaces(agent: ESIAgent): Races {
  return <Races> <any> function () {
    return agent.request('get_universe_races', undefined);
  };
}
