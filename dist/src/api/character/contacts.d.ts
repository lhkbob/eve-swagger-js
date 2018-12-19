import { SSOAgent } from '../../internal/esi-agent';
import { Responses } from '../../../gen/esi';
/**
 * An api adapter that provides functions for modifying and removing a
 * particular contact of a character, specified by id via functions in the
 * [contacts](https://esi.evetech.net/latest/#/Contacts) ESI endpoints.
 */
export interface Contact {
    /**
     * @esi_route delete_characters_character_id_contacts
     * @esi_param !contact_ids
     * @esi_example esi.characters(1, 'token').contacts(2).del()
     *
     * @returns An empty Promise resolving when the request finishes
     */
    del(): Promise<Responses['delete_characters_character_id_contacts']>;
    /**
     * Update a contact that is not to be watched.
     *
     * @esi_example esi.characters(1, 'token').contacts(2).update(...)
     *
     * @param standing The standing to update the contact to
     * @param labelID Optional ID of a label to assign to the contact, no ID
     *  removes the label
     *
     * @returns An empty Promise resolving when the update finishes
     */
    update(standing: number, labelID?: number): Promise<Responses['put_characters_character_id_contacts']>;
    /**
     * Update a contact that is to be watched.
     *
     * @esi_example esi.characters(1, 'token').contacts(2).updateWatched(...)
     *
     * @param standing The standing to update the contact to
     * @param labelID Optional ID of a label to assign to the contact, no ID
     *  removes the label
     *
     * @returns An empty Promise resolving when the update finishes
     */
    updateWatched(standing: number, labelID?: number): Promise<Responses['put_characters_character_id_contacts']>;
    /**
     * @returns The contact's id
     */
    id(): Promise<number>;
}
/**
 * An api adapter over the end points handling a character's contacts via
 * functions in the [contacts](https://esi.evetech.net/latest/#/Contacts)
 * ESI endpoints.
 */
export interface Contacts {
    /**
     * @esi_example esi.characters(1, 'token').contacts()
     *
     * @returns A list of all contact information for the character
     */
    (): Promise<Responses['get_characters_character_id_contacts']>;
    /**
     * Create a new Contact end point targeting the particular contact by
     * `id`.
     *
     * @param id The contact id
     * @returns A Contact API wrapper
     */
    (id: number): Contact;
    /**
     * @esi_example esi.characters(1, 'token').contacts.labels()
     *
     * @returns Information on all contact labels for the character
     */
    labels(): Promise<Responses['get_characters_character_id_contacts_labels']>;
    /**
     * Add possibly multiple contacts, all with the same assigned standing and
     * optional label. The contacts are not watched.
     *
     * @esi_example esi.characters(1, 'token').contacts.add(ids, ...)
     *
     * @param ids List of ids to add as contacts, e.g. characters, corporations or
     * alliances
     * @param standing The standing to assign to the new contacts
     * @param labelID The optional label to add to each contact
     *
     * @returns An array created contact ids, parallel to the input ids
     */
    add(ids: number[], standing: number, labelID?: number): Promise<Responses['post_characters_character_id_contacts']>;
    /**
     * Add possibly multiple contacts, all with the same assigned standing and
     * optional label. The contacts are watched.
     *
     * @esi_example esi.characters(1, 'token').contacts.add(ids, ...)
     *
     * @param ids List of ids to add as contacts, e.g. characters, corporations or
     * alliances
     * @param standing The standing to assign to the new contacts
     * @param labelID The optional label to add to each contact
     *
     * @returns An array created contact ids, parallel to the input ids
     */
    addWatched(ids: number[], standing: number, labelID?: number): Promise<Responses['post_characters_character_id_contacts']>;
}
/**
 * Create a new {@link Contacts} instance that uses the given character agent to
 * make its HTTP requests to the ESI interface.
 *
 * @param char The character access information
 * @returns An Contacts API instance
 */
export declare function makeContacts(char: SSOAgent): Contacts;
