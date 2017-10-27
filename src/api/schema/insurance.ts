import {ESIAgent} from '../../internal/esi-agent';
import {Responses} from '../../esi';

/**
 * An api adapter that provides functions for accessing the
 * [insurance](https://esi.tech.ccp.is/latest/#/Insurance) ESI end points.
 */
export class Insurance {
  constructor(private agent:ESIAgent) {}

  /**
   * @return Insurance price levels
   */
  prices() :Promise<Responses['get_insurance_prices']> {
    return this.agent.request('get_insurance_prices', undefined);
  }
}
