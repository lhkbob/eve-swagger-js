import { ESIAgent } from '../../internal/esi-agent';
import { Responses, esi } from '../../esi';

import * as r from '../../internal/resource-api';

/**
 * The API specification for all variants that access information about an
 * planetary interaction schematic or multiple schematics. This interface will
 * not be used directly, but will be filtered through some mapper, such as
 * {@link Async} or {@link Mapped} depending on what types of ids are being
 * accessed. However, this allows for a concise and consistent specification for
 * all variants: single, multiple, and all schematics.
 *
 * When mapped, each key defined in this interface becomes a function that
 * returns a Promise resolving to the key's type, or a collection related to the
 * key's type if multiple schematics are being accessed at once.
 *
 * This is an API wrapper over the end points handling schematics in the
 * [planetary
 * interaction](https://esi.tech.ccp.is/latest/#/Planetary_Interaction) ESI
 * endpoints.
 */
export interface SchematicAPI {
  details: Responses['get_universe_schematics_schematic_id'];
}

/**
 * An api adapter for accessing various details of a single PI schematic,
 * specified by a provided id when the api is instantiated.
 */
export class Schematic extends r.impl.SimpleResource implements r.Async<SchematicAPI> {
  constructor(private agent: ESIAgent, id: number) {
    super(id);
  }

  /**
   * @returns Information about the schematic
   */
  details() {
    return getDetails(this.agent, this.id_);
  }
}

/**
 * An api adapter for accessing various details of multiple schematic ids,
 * specified by a provided an array or set of ids when the api is instantiated.
 */
export class MappedSchematics extends r.impl.SimpleMappedResource implements r.Mapped<SchematicAPI> {
  constructor(private agent: ESIAgent, ids: number[] | Set<number>) {
    super(ids);
  }

  /**
   * @returns Schematic details mapped by schematic id
   */
  details() {
    return this.getResource(id => getDetails(this.agent, id));
  }
}

/**
 * A functional interface for getting APIs for a specific schematic or a
 * known set of schematic ids. There is currently no way to iterate over all
 * schematics in the game.
 */
export interface SchematicAPIFactory {
  /**
   * Create a new schematic api targeting the particular schematic by `id`.
   *
   * @param id The schematic id
   * @returns An Schematic API wrapper for the given id
   */
  (id: number): Schematic;

  /**
   * Create a new schematic api targeting the multiple schematic ids. If an
   * array is provided, duplicates are removed (although the input array is not
   * modified).
   *
   * @param ids The schematic ids
   * @returns A MappedSchematics API wrapper for the given ids
   */
  (ids: number[] | Set<number>): MappedSchematics;
}

/**
 * Create a new SchematicAPIFactory instance that uses the given `agent` to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns A SchematicAPIFactory instance
 */
export function makeSchematicAPIFactory(agent: ESIAgent): SchematicAPIFactory {
  return <SchematicAPIFactory> function (ids: number | number[] | Set<number>) {
    if (typeof ids === 'number') {
      // Single id so single API
      return new Schematic(agent, ids);
    } else {
      // Set or array, so mapped API
      return new MappedSchematics(agent, ids);
    }
  };
}

function getDetails(agent: ESIAgent, id: number) {
  return agent.request('get_universe_schematics_schematic_id',
      { path: { schematic_id: id } });
}
