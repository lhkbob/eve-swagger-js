import { ESIAgent } from '../../internal/esi-agent';
import { Responses } from '../../../gen/esi';
/**
 * An api adapter that provides functions for accessing the non-authenticated
 * [planetary
 * interaction](https://esi.evetech.net/latest/#/Planetary_Interaction) ESI end
 *  points.
 */
export interface PlanetaryInteraction {
    /**
     * @esi_example esi.pi.schematic(id)
     *
     * @param id The schematic's ID
     * @return Details on the specific planetary interaction schematic
     */
    (id: number): Promise<Responses['get_universe_schematics_schematic_id']>;
}
/**
 * Create a new {@link PlanetaryInteraction} instance that uses the given
 * `agent` to make its HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns An PlanetaryInteraction API instance
 */
export declare function makePlanetaryInteraction(agent: ESIAgent): PlanetaryInteraction;
