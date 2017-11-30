import { esi, Responses } from '../../esi';

import { getBatchedValues, getIteratedValues } from '../../internal/batch';
import { SSOAgent } from '../../internal/esi-agent';
import * as r from '../../internal/resource-api';

const DELETE_CONTACTS_BATCH_SIZE = 100;
const PUT_CONTACTS_BATCH_SIZE = 100;
const ADD_CONTACTS_BATCH_SIZE = 100;

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
export class Contact extends r.impl.SimpleResource implements r.Async<ContactAPI> {
  private contacts_?: r.impl.ResourceStreamer<esi.character.Contact>;

  constructor(private agent: SSOAgent<number>, id: number) {
    super(id);
  }

  /**
   * @esi_route ~get_characters_character_id_contacts
   *
   * @returns Details about the specific contact
   */
  details() {
    if (this.contacts_ === undefined) {
      this.contacts_ = getContacts(this.agent);
    }
    return r.impl.filterIterated(this.contacts_(), this.id_, e => e.contact_id);
  }

  /**
   * Delete the specific contact for the character.
   *
   * @esi_route delete_characters_character_id_contacts
   *
   * @returns An empty promise that resolves after the contact has been deleted
   */
  del(): Promise<undefined> {
    return deleteContacts(this.agent, [this.id_]).then(ids => undefined);
  }

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
  update(standing: number, label: number = 0,
      watched: boolean = false): Promise<undefined> {
    return updateContacts(this.agent, [this.id_], standing, label, watched)
    .then(ids => undefined);
  }
}

/**
 * An api adapter for accessing various details of multiple contact ids,
 * specified by a provided an array or set of ids when the api is instantiated.
 */
export class MappedContacts extends r.impl.SimpleMappedResource implements r.Mapped<ContactAPI> {
  private contacts_?: r.impl.ResourceStreamer<esi.character.Contact>;

  constructor(private agent: SSOAgent<number>, ids: number[] | Set<number>) {
    super(ids);
  }

  /**
   * @esi_route ~get_characters_character_id_contacts
   *
   * @returns The contact details, mapped by id
   */
  details() {
    if (this.contacts_ === undefined) {
      this.contacts_ = getContacts(this.agent);
    }

    return this.arrayIDs()
    .then(ids => r.impl.filterIteratedToMap(this.contacts_!(), ids,
        e => e.contact_id));
  }

  /**
   * Delete the specific contacts for the character.
   *
   * @esi_route delete_characters_character_id_contacts
   *
   * @returns An empty promise that resolves after the contacts have been
   *     deleted
   */
  del(): Promise<undefined> {
    // Discard the map from id to undefined after they have completed
    return this.arrayIDs()
    .then(
        ids => getBatchedValues(ids, idSet => deleteContacts(this.agent, idSet),
            id => [id, undefined], DELETE_CONTACTS_BATCH_SIZE))
    .then(map => undefined);
  }

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
  update(standing: number, label: number = 0,
      watched: boolean = false): Promise<undefined> {
    // Discard the map from id to undefined after they have completed
    return this.arrayIDs()
    .then(ids => getBatchedValues(ids,
        idSet => updateContacts(this.agent, idSet, standing, label, watched),
        id => [id, undefined], PUT_CONTACTS_BATCH_SIZE))
    .then(map => undefined);
  }
}

/**
 * An api adapter for accessing various details about every contact registered
 * to the character.
 */
export class IteratedContacts extends r.impl.SimpleIteratedResource<esi.character.Contact> implements r.Iterated<ContactAPI> {
  constructor(private agent: SSOAgent<number>) {
    super(getContacts(agent), e => e.contact_id);
  }

  /**
   * @returns The contact details for every contact of the character
   */
  details() {
    return this.getPaginatedResource();
  }

  /**
   * An iterator that progressively deletes every contact of the character.
   * This does not make use of batched deletes so that for-await loops can
   * terminate without having deleted contacts not yet seen by the loop.
   *
   * The reported number is the contact id that was deleted.
   *
   * @esi_route delete_characters_character_id_contacts
   *
   * @returns An iterator over contacts that have just been deleted
   */
  async * del(): AsyncIterableIterator<number> {
    for await (let id of this.ids()) {
      await deleteContacts(this.agent, [id]);
      yield id;
    }
  }

  /**
   * Delete every contact from the character. Makes use of batched requests to
   * reduce the number of total requests at the expense of not being able to
   * terminate at an intermediate point.
   *
   * @returns The number of deleted contacts
   */
  async deleteAll(): Promise<number> {
    let count = 0;
    for await (let id of getIteratedValues(this.ids(),
        idSet => deleteContacts(this.agent, idSet), id => [id, undefined],
        DELETE_CONTACTS_BATCH_SIZE)) {
      count++;
    }
    return count;
  }

  /**
   * An iterator that progressively updates every contact of the character.
   * This does not make use of batched updates so that for-await loops can
   * terminate without having updated contacts not yet seen by the loop.
   *
   * The reported number is the contact id that was updated.
   *
   * @esi_route put_characters_character_id_contacts
   *
   * @param standing The new standing of the contacts
   * @param label The new label for the contacts, if not provided or 0 the label
   *     is removed from the contact
   * @param watched Whether or not the contacts is watched, defaults to false
   * @returns An iterator over contacts that have just been updated
   */
  async * update(standing: number, label: number = 0,
      watched: boolean = false): AsyncIterableIterator<number> {
    for await (let id of this.ids()) {
      await updateContacts(this.agent, [id], standing, label, watched);
      yield id;
    }
  }

  /**
   * Update every contact from the character. Makes use of batched requests to
   * reduce the number of total requests at the expense of not being able to
   * terminate at an intermediate point.
   *
   * @param standing The new standing of the contacts
   * @param label The new label for the contacts, if not provided or 0 the label
   *     is removed from the contact
   * @param watched Whether or not the contacts is watched, defaults to false
   * @returns The number of updated contacts
   */
  async updateAll(standing: number, label: number = 0,
      watched: boolean = false): Promise<number> {
    let count = 0;
    for await (let id of getIteratedValues(this.ids(),
        idSet => updateContacts(this.agent, idSet, standing, label, watched),
        id => [id, undefined], PUT_CONTACTS_BATCH_SIZE)) {
      count++;
    }
    return count;
  }
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
  (id: number): Event;

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
  add(ids: number[], standing: number, labelID?: number,
      watched?: boolean): Promise<Map<number, number>>;
}

/**
 * Create a new {@link Contacts} instance that uses the given character agent to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The character access information
 * @returns An Contacts API instance
 */
export function makeContacts(agent: SSOAgent<number>): Contacts {
  let contacts = <Contacts> function (ids: number | number[] | Set<number> | undefined) {
    if (ids === undefined) {
      // All contacts
      return new IteratedContacts(agent);
    } else if (typeof ids === 'number') {
      // Single contact
      return new Contact(agent, ids);
    } else {
      // Multiple contacts
      return new MappedContacts(agent, ids);
    }
  };

  contacts.labels = function () {
    return agent.agent.request('get_characters_character_id_contacts_labels',
        { path: { character_id: agent.id } }, agent.ssoToken);
  };
  contacts.add = function (ids: number[], standing: number, label: number = 0,
      watched: boolean = false) {
    return getBatchedValues(ids,
        idSet => addContacts(agent, idSet, standing, label, watched),
        (e, id) => [id, e], ADD_CONTACTS_BATCH_SIZE);
  };

  return contacts;
}

function getContactsPage(agent: SSOAgent<number>, page: number) {
  return agent.agent.request('get_characters_character_id_contacts',
      { path: { character_id: agent.id }, query: { page: page } },
      agent.ssoToken).then(result => ({ result, maxPages: undefined }));
}

function getContacts(agent: SSOAgent<number>) {
  return r.impl.makePageBasedStreamer(page => getContactsPage(agent, page));
}

function addContacts(agent: SSOAgent<number>, contacts: number[],
    standing: number, label: number, watched: boolean) {
  return agent.agent.request('post_characters_character_id_contacts', {
    path: { character_id: agent.id },
    query: { standing: standing, label_id: label, watched: watched },
    body: contacts
  }, agent.ssoToken);
}

function deleteContacts(agent: SSOAgent<number>,
    contacts: number[]): Promise<number[]> {
  return agent.agent.request('delete_characters_character_id_contacts',
      { path: { character_id: agent.id }, body: contacts })
  .then(() => contacts);
}

function updateContacts(agent: SSOAgent<number>, contacts: number[],
    standing: number, label: number, watched: boolean): Promise<number[]> {
  return agent.agent.request('put_characters_character_id_contacts', {
    path: { character_id: agent.id },
    query: { label_id: label, standing: standing, watched: watched },
    body: contacts
  }, agent.ssoToken).then(() => contacts);
}
