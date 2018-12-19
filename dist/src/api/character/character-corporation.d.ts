import { SSOAgent } from '../../internal/esi-agent';
import { Responses } from '../../../gen/esi';
import { Corporation } from '../corporations';
/**
 * An api adapter that provides functions for accessing various details for a
 * corporation specified by id via functions in the
 * [corporation](https://esi.evetech.net/latest/#/Corporation) ESI endpoints.
 * This sub-interface of {@link Corporation} adds all remaining corporation
 * routes that require authentication. Additionally, the corporation id is
 * automatically inferred from the creating character's member corp.
 */
export interface CharacterCorporation extends Corporation {
    /**
     * @esi_route get_corporations_corporation_id_members
     * @esi_example esi.characters(1, 'token').corporation.members()
     *
     * @returns The array of character ids within the corporation
     */
    members(): Promise<number[]>;
    /**
     * @esi_example esi.characters(1, 'token').corporation.roles()
     *
     * @returns All members and their roles
     */
    roles(): Promise<Responses['get_corporations_corporation_id_roles']>;
    /**
     * @esi_example esi.characters(1, 'token').corporation.structures()
     *
     * @param page If `0`, all structures are returned
     *
     * @returns Structures owned by the corporation
     */
    structures(page?: number): Promise<Responses['get_corporations_corporation_id_structures']>;
}
/**
 * Create a new {@link CharacterCorporation} instance that uses the given
 * `char` to make its HTTP requests to the ESI interface.
 *
 * @param char The character information for making actual requests
 * @returns An CharacterCorporation API instance
 */
export declare function makeCharacterCorporation(char: SSOAgent): CharacterCorporation;
