import { esi, Responses } from '../../esi';
import { SSOAgent } from '../../internal/esi-agent';
import * as r from '../../internal/resource-api';
/**
 * The API specification for all variants that access information about a
 * character's contact or contacts. This interface will not be used directly,
 * but will be filtered through some mapper, such as {@link Async} or {@link
    * Mapped} depending on what types of ids are being accessed. However, this
 * allows for a concise and consistent specification for all variants: single,
 * multiple, and all contacts.
 *
 * When mapped, each key defined in this interface becomes a function that
 * returns a Promise resolving to the key's member, or a collection related to
 * the key's member if multiple contacts are being accessed at once.
 *
 * An api adapter over the end points handling a specific event via functions in
 * the [contacts](https://esi.tech.ccp.is/latest/#Contacts) ESI endpoints.
 */
export interface ContactAPI {
    details: esi.character.Contact;
}
/**
 * An api adapter for accessing various details of a single contact,
 * specified by a provided contact id when the api is instantiated.
 */
export declare class Contact extends r.impl.SimpleResource implements r.Async<ContactAPI> {
    private agent;
    private contacts_?;
    constructor(agent: SSOAgent<number>, id: number);
    /**
     * @esi_route ~get_characters_character_id_contacts
     *
     * @returns Details about the specific contact
     */
    details(): Promise<esi.character.Contact>;
    /**
     * Delete the specific contact for the character.
     *
     * @esi_route delete_characters_character_id_contacts
     *
     * @returns An empty promise that resolves after the contact has been deleted
     */
    del(): Promise<undefined>;
    /**
     * Update the specific contact for the character with a new standing and
     * optionally a new label and watched state.
     *
     * @esi_route put_characters_character_id_contacts
     *
     * @param standing The new standing of the contact
     * @param label The new label for the contact, if not provided or 0 the label
     *     is removed from the contact
     * @param watched Whether or not the contact is watched, defaults to false
     * @returns An empty promise resolving when the request completes
     */
    update(standing: number, label?: number, watched?: boolean): Promise<undefined>;
}
/**
 * An api adapter for accessing various details of multiple contact ids,
 * specified by a provided an array or set of ids when the api is instantiated.
 */
export declare class MappedContacts extends r.impl.SimpleMappedResource implements r.Mapped<ContactAPI> {
    private agent;
    private contacts_?;
    constructor(agent: SSOAgent<number>, ids: number[] | Set<number>);
    /**
     * @esi_route ~get_characters_character_id_contacts
     *
     * @returns The contact details, mapped by id
     */
    details(): Promise<Map<number, esi.character.Contact>>;
    /**
     * Delete the specific contacts for the character.
     *
     * @esi_route delete_characters_character_id_contacts
     *
     * @returns An empty promise that resolves after the contacts have been
     *     deleted
     */
    del(): Promise<undefined>;
    /**
     * Update the specific contact for the character with a new standing and
     * optionally a new label and watched state.
     *
     * @esi_route put_characters_character_id_contacts
     *
     * @param standing The new standing of the contacts
     * @param label The new label for the contacts, if not provided or 0 the label
     *     is removed from the contacts
     * @param watched Whether or not the contacts is watched, defaults to false
     * @returns An empty promise resolving when the request completes
     */
    update(standing: number, label?: number, watched?: boolean): Promise<undefined>;
}
/**
 * An api adapter for accessing various details about every contact registered
 * to the character.
 */
export declare class IteratedContacts extends r.impl.SimpleIteratedResource<esi.character.Contact> implements r.Iterated<ContactAPI> {
    private agent;
    constructor(agent: SSOAgent<number>);
    /**
     * @returns The contact details for every contact of the character
     */
    details(): AsyncIterableIterator<[number, esi.character.Contact]>;
}
/**
 * A functional interface for creating APIs to access a single contact, a
 * specific set of contacts, or every contact registered to a character. It
 * additionally has members for adding new contacts.
 */
export interface Contacts {
    /**
     * Create a new contacts api targeting every contact of the character.
     *
     * @returns An IteratedCalendar API wrapper
     */
    (): IteratedContacts;
    /**
     * Create a new contacts end point targeting the particular contact by `id`.
     *
     * @param id The contact's id
     * @returns An Contact API wrapper for the id
     */
    (id: number): Contact;
    /**
     * Create a new contacts api targeting the multiple contacts ids. If an array
     * is provided, duplicates are removed (although the input array is not
     * modified).
     *
     * @param ids The contact ids
     * @returns A MappedContacts API wrapper
     */
    (ids: number[] | Set<number>): MappedContacts;
    /**
     * @returns Information on all contact labels for the character
     */
    labels(): Promise<Responses['get_characters_character_id_contacts_labels']>;
    /**
     * Add possibly multiple contacts, all with the same assigned standing and
     * optional label. The contacts are not watched.
     *
     * @esi_route post_characters_character_id_contacts
     *
     * @param ids List of ids to add as contacts, e.g. characters, corporations
     *     or alliances
     * @param standing The standing to assign to the new contacts
     * @param labelID The optional label to add to each contact
     * @param watched Whether or not the contacts will be watched, defaults to
     *     false
     *
     * @returns A map from input id to the created contact id
     */
    add(ids: number[], standing: number, labelID?: number, watched?: boolean): Promise<Map<number, number>>;
}
/**
 * Create a new {@link Contacts} instance that uses the given character agent to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The character access information
 * @returns An Contacts API instance
 */
export declare function makeContacts(agent: SSOAgent<number>): Contacts;
