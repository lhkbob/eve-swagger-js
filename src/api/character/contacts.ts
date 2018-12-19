import {
  PaginatedLoader, makePageBasedLoader
} from '../../internal/page-loader';
import { SSOAgent } from '../../internal/esi-agent';
import { Responses, esi } from '../../../gen/esi';

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
  update(standing: number,
      labelID?: number): Promise<Responses['put_characters_character_id_contacts']>;

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
  updateWatched(standing: number,
      labelID?: number): Promise<Responses['put_characters_character_id_contacts']>;

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
  add(ids: number[], standing: number,
      labelID?: number): Promise<Responses['post_characters_character_id_contacts']>;

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
  addWatched(ids: number[], standing: number,
      labelID?: number): Promise<Responses['post_characters_character_id_contacts']>;
}

/**
 * Create a new {@link Contacts} instance that uses the given character agent to
 * make its HTTP requests to the ESI interface.
 *
 * @param char The character access information
 * @returns An Contacts API instance
 */
export function makeContacts(char: SSOAgent): Contacts {
  function addContacts(watched: boolean, ids: number[], standing: number,
      labelID?: number) {
    return char.agent.request('post_characters_character_id_contacts', {
      path: { character_id: char.id },
      query: { watched: watched, standing: standing, label_id: labelID },
      body: ids
    }, char.ssoToken);
  }

  const allContacts: PaginatedLoader<esi.character.Contact> = makePageBasedLoader(
      page => char.agent.request('get_characters_character_id_contacts',
          { path: { character_id: char.id }, query: { page: page } },
          char.ssoToken));
  let contacts = <Contacts> <any> function (id?: number) {
    if (id === undefined) {
      return allContacts.getAll();
    } else {
      return new ContactImpl(char, id);
    }
  };

  contacts.labels = function () {
    return char.agent.request('get_characters_character_id_contacts_labels',
        { path: { character_id: char.id } }, char.ssoToken);
  };
  contacts.add = function (ids: number[], standing: number, labelID?: number) {
    return addContacts(false, ids, standing, labelID);
  };
  contacts.addWatched = function (ids: number[], standing: number,
      labelID?: number) {
    return addContacts(true, ids, standing, labelID);
  };

  return contacts;
}

class ContactImpl implements Contact {
  constructor(private char: SSOAgent, private id_: number) {
  }

  del() {
    return this.char.agent.request('delete_characters_character_id_contacts', {
      path: { character_id: this.char.id }, body: [this.id_]
    }, this.char.ssoToken);
  }

  private updateContact(watched: boolean, standing: number, label?: number) {
    return this.char.agent.request('put_characters_character_id_contacts', {
      path: { character_id: this.char.id }, query: {
        label_id: label, standing: standing, watched: watched
      }, body: [this.id_]
    }, this.char.ssoToken);
  }

  update(standing: number, label?: number) {
    return this.updateContact(false, standing, label);
  }

  updateWatched(standing: number, label?: number) {
    return this.updateContact(true, standing, label);
  }

  id() {
    return Promise.resolve(this.id_);
  }
}
