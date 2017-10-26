import { ESIAgent } from '../../internal/esi-agent';
import { Responses, esi } from '../../esi';

import {
  Asynchronous, ArrayResourceAPI, Arrayed
} from '../../internal/resource-api';

/**
 * The API specification for all API variants that access information about an
 * incursion or multiple incursions. This interface will not be used directly,
 * but will be filtered through some mapper, such as {@link Asynchronous} or
 * {@link Mapped} depending on what types of ids are being accessed. However,
 * this allows for a concise and consistent specification for all variants:
 * single, multiple, and all incursions.
 *
 * When mapped, each key defined in this interface becomes a function that
 * returns a Promise resolving to the key's type, or a collection related to
 * the key's type if multiple incursions are being accessed at once.
 *
 * The staging system id of the incursion is used as an artificial id for
 * incursions since an explicit id is not provided.
 */
export interface IncursionInfo {
  details: esi.Incursion;
}

// FIXME should we just include MappedIncursionsAPI?
// FIXME does a resource as simple as Incursions need this full treatment?

/**
 * An api adapter over the end points handling incursions  via functions in the
 * [incursions](https://esi.tech.ccp.is/latest/#/Incursions) ESI endpoints.
 */
export type AllIncursionsAPI =
    Arrayed<IncursionInfo>
    & ArrayResourceAPI<'incursion'>;

/**
 * Create a new {@link AllIncursionsAPI} instance that uses the given `agent` to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns An Incursions API instance
 */
export function makeIncursionsAPI(agent: ESIAgent): AllIncursionsAPI {
  return new AllIncursionInfoImpl(agent);
}

class AllIncursionInfoImpl extends ArrayResourceAPI<'incursion'> implements Arrayed<IncursionInfo> {
  constructor(private agent: ESIAgent) {
    super('incursion');
  }

  private getAll(): Promise<Responses['get_incursions']> {
    return this.agent.request('get_incursions', undefined);
  }

  details() {
    return this.getAll()
    .then(all => all.map(
        e => <[number, esi.Incursion]> [e.staging_solar_system_id, e]));
  }

  ids() {
    return this.getAll().then(all => all.map(e => e.staging_solar_system_id));
  }
}