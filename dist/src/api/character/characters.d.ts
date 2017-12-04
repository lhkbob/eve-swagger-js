import { ESIAgent } from '../../internal/esi-agent';
import { Responses, esi } from '../../esi';
import * as r from '../../internal/resource-api';
/**
 * The API specification for all variants that access information about a
 * character or multiple characters. This interface will not be used
 * directly, but will be filtered through some mapper, such as {@link Async} or
 * {@link Mapped} depending on what types of ids are being accessed. However,
 * this allows for a concise and consistent specification for all variants:
 * single, multiple, and all characters.
 *
 * When mapped, each key defined in this interface becomes a function that
 * returns a Promise resolving to the key's type, or a collection related to the
 * key's type if multiple characters are being accessed at once.
 *
 * This is an API wrapper over the end points handling characters via
 * functions in the [character](https://esi.tech.ccp.is/latest/#/Character)
 * ESI endpoints.
 */
export interface CharacterAPI {
    details: Responses['get_characters_character_id'];
    history: Responses['get_characters_character_id_corporationhistory'];
    portraits: Responses['get_characters_character_id_portrait'];
    affiliations: esi.character.Affiliation;
    names: string;
}
/**
 * An api adapter that provides functions for viewing public (non-authenticated)
 * information about a specific character  via functions in the
 * [character](https://esi.tech.ccp.is/latest/#/Character) ESI endpoints.
 */
export declare class Character extends r.impl.SimpleResource implements r.Async<CharacterAPI> {
    private agent;
    constructor(agent: ESIAgent, id: number);
    /**
     * @returns Public information about the specified character
     */
    details(): Promise<esi.character.Character>;
    /**
     * @returns Image URLs for the character's portrait
     */
    portraits(): Promise<esi.character.Portrait>;
    /**
     * @returns The character's corporation history
     */
    history(): Promise<esi.character.CorporationHistory[]>;
    /**
     * @esi_route ~get_characters_character_id
     *
     * @returns The character's corporation, and optionally alliance and faction
     *    affiliations
     */
    affiliations(): Promise<{
        character_id: number;
        faction_id: number | undefined;
        alliance_id: number | undefined;
        corporation_id: number;
    }>;
    /**
     * @esi_route ~get_characters_character_id
     *
     * @returns The name of the character
     */
    names(): Promise<string>;
}
/**
 * An api adapter for accessing various details of multiple characters,
 * specified by a provided an array, set of ids, or search query when the api is
 * instantiated.
 */
export declare class MappedCharacters extends r.impl.SimpleMappedResource implements r.Mapped<CharacterAPI> {
    private agent;
    constructor(agent: ESIAgent, ids: number[] | Set<number> | r.impl.IDSetProvider);
    /**
     * @returns Details for the characters, mapped by their id
     */
    details(): Promise<Map<number, esi.character.Character>>;
    /**
     * @returns Portrait URLs for the characters, mapped by their id
     */
    portraits(): Promise<Map<number, esi.character.Portrait>>;
    /**
     * @returns Corporation histories for the characters, mapped by their id
     */
    history(): Promise<Map<number, esi.character.CorporationHistory[]>>;
    /**
     * @esi_route post_characters_affiliation
     *
     * @returns Corporation, alliance, and faction affiliations for the
     *     characters, mapped by their id
     */
    affiliations(): Promise<Map<number, esi.character.Affiliation>>;
    /**
     * @esi_route post_universe_names [character]
     * @esi_route get_characters_names
     *
     * @returns Character name mapped by their id
     */
    names(): Promise<Map<any, any>>;
}
