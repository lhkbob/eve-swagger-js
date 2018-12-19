import { SSOAgent } from '../../internal/esi-agent';
import { Responses } from '../../../gen/esi';
/**
 * An api adapter over the end points handling a specific colony via functions
 * in the [planetary
 * interaction](https://esi.evetech.net/latest/#Planetary_Interaction) ESI
 * endpoints.
 */
export interface Colony {
    /**
     * @esi_example esi.characters(1, 'token').colonies(2).layout()
     *
     * @returns The layout of the colony
     */
    layout(): Promise<Responses['get_characters_character_id_planets_planet_id']>;
    /**
     * @returns The colony's id.
     */
    id(): Promise<number>;
}
/**
 * An api adapter over the end points handling the planetary interaction
 * colonies for a character via functions in the [planetary
 * interaction](https://esi.evetech.net/latest/#/Planetary_Interaction) ESI
 * endpoints.
 */
export interface Colonies {
    /**
     * @esi_example esi.characters(1, 'token').colonies()
     *
     * @returns List of the character's PI colony ids.
     */
    (): Promise<Responses['get_characters_character_id_planets']>;
    /**
     * Create a Colony API wrapper for the colony of the specific planet.
     *
     * @param planetId The planet's id
     * @returns A Colony API wrapper for the planet
     */
    (planetId: number): Colony;
}
/**
 * Create a new {@link Colonies} instance that uses the given character agent to
 * make its HTTP requests to the ESI interface.
 *
 * @param char The character access information
 * @returns An Colonies API instance
 */
export declare function makeColonies(char: SSOAgent): Colonies;
