const ExtendableFunction = require('../../internal/ExtendableFunction');
const [PageHandler,] = require('../../internal/PageHandler');

/**
 * An api adapter that provides functions for modifying and removing a
 * particular contact of a character, specified by id via functions in the
 * [contacts](https://esi.tech.ccp.is/latest/#/Contacts) ESI endpoints.
 *
 * You should not usually instantiate this directly as its constructor requires
 * an internal api instance.
 */
class Contact {
  /**
   * Create a new Contact represented as `contactId` from the given `contacts`.
   *
   * @param contacts {Contacts} The contacts owning the contact
   * @param contactId {Number} The contact id that is used for all requests
   * @constructor
   */
  constructor(contacts, contactId) {
    this._contacts = contacts;
    this._id = contactId;
  }

  /**
   * Remove the contact the character's contact list via the ESI end point.
   * This makes an HTTP DELETE request to
   * [`/characters/{characterId}/contacts`](https://esi.tech.ccp.is/latest/#!/Contacts/delete_characters_character_id_contacts).
   * The request is returned as an asynchronous Promise that resolves to an
   * empty object from the response JSON model.
   *
   * @return {Promise} A Promise that resolves to the response of
   *   the request
   * @esi_link ContactsApi.deleteCharactersCharacterIdContacts
   */
  remove() {
    return this._contacts._api.contacts(this._contacts._token)
    .newRequest('deleteCharactersCharacterIdContacts',
        [this._contacts._id, [this._id]]);
  }

  _updateContact(standing, label, watched) {
    let opts = {
      watched: watched,
      label: label
    };
    return this._contacts._api.contacts(this._contacts._token)
    .newRequest('putCharactersCharacterIdContacts',
        [this._contacts._id, [this._id], standing], opts);
  }

  /**
   * Update the character's contact to have the given settings via the ESI end
   * point. This makes an HTTP PUT request to
   * [`/characters/{characterId}/contacts`](https://esi.tech.ccp.is/latest/#!/Contacts/put_characters_character_id_contacts).
   * The request is returned as an asynchronous Promise that resolves to an
   * empty object on success.
   *
   * The updated contacts are set to unwatched.
   *
   * @param {Number} standing The standing for all contacts
   * @param {Number} label Optional; custom label id to add contacts to. If
   *     not provided, the contact has its previous label removed
   * @return {Promise} A Promise that resolves to the response of  the request
   * @esi_link ContactsApi.putCharactersCharacterIdContacts
   */
  update(standing, label = 0) {
    return this._updateContact(standing, label, false);
  }

  /**
   * Update the character's contact to have the given settings via the ESI end
   * point. This makes an HTTP PUT request to
   * [`/characters/{characterId}/contacts`](https://esi.tech.ccp.is/latest/#!/Contacts/put_characters_character_id_contacts).
   * The request is returned as an asynchronous Promise that resolves to an
   * empty object on success.
   *
   * The updated contacts are set to watched.
   *
   * @param {Number} standing The standing for all contacts
   * @param {Number} label Optional; custom label id to add contacts to. If
   *     not provided, the contact has its previous label removed
   * @return {Promise} A Promise that resolves to the response of  the request
   * @esi_link ContactsApi.putCharactersCharacterIdContacts
   */
  updateWatched(standing, label = 0) {
    return this._updateContact(standing, label, true);
  };
}

/**
 * An api adapter over the end points handling a character's contacts via
 * functions in the [contacts](https://esi.tech.ccp.is/latest/#/Contacts)
 * ESI endpoints. You should not usually instantiate this directly as its
 * constructor requires an internal api instance.
 *
 * This is a function class so instances of `Contacts` are functions and can be
 * invoked directly, besides accessing its members. Its default function action
 * is equivalent to {@link Contacts#get get} or {@link Contacts#all all} if no
 * id is provided.
 */
class Contacts extends ExtendableFunction {
  /**
   * Create a new Contacts function using the given `api`, for the
   * character described by `characterId` with SSO access from `token`.
   *
   * @param api {ApiProvider} The api provider
   * @param characterId {Number} The character id whose contacts are accessed
   * @param token {String} The SSO access token for the character
   * @constructor
   */
  constructor(api, characterId, token) {
    super(id => (id ? this.get(id) : this.all()));

    this._api = api;
    this._id = characterId;
    this._token = token;
    this._all = new PageHandler(page => this.all(page));
  }

  /**
   * Get the contacts for the given character via the ESI end point. The `page`
   * parameter controls which page is selected. This makes an HTTP GET request
   * to
   * [`/characters/{id}/contacts`](https://esi.tech.ccp.is/latest/#!/Contacts/get_characters_character_id_contacts).
   * The request is returned as an asynchronous Promise that resolves to an
   * array parsed from the response JSON model. An example value looks like:
   *
   * ```
   * [
   *   {
   *     "contact_id": 123,
   *     "contact_type": "character",
   *     "is_blocked": false,
   *     "is_watched": true,
   *     "standing": 10
   *   }
   * ]
   * ```
   *
   * Technically, this end point is paginated by ESI. If invoked without a page
   * argument, the end point will be queried multiple times to fetch the
   * entirety of groups.
   *
   * @param page {Number} Optional; the page of groups to return, starting with
   *     page 1. If not provided, all groups are returned.
   * @return {Promise} A Promise that resolves to the response of the request
   * @esi_link ContactsApi.getCharactersCharacterIdContacts
   */
  all(page = 0) {
    if (page == 0) {
      return this._all.getAll();
    } else {
      return this._api.contacts(this._token)
      .newRequest('getCharactersCharacterIdContacts', [this._id],
          { page: page });
    }
  }

  /**
   * Get a list of custom labels for the given character's contacts via the ESI
   * end point. This makes an HTTP GET request to
   * [`/characters/{id}/contacts/labels`](https://esi.tech.ccp.is/latest/#!/Contacts/get_characters_character_id_contacts_labels).
   * The request is returned as an asynchronous Promise that resolves to an
   * array parsed from the response JSON model. An example value looks like:
   *
   * ```
   * [
   *   {
   *     "label_id": 123,
   *     "label_name": "Friends"
   *   }
   * ]
   * ```
   *
   * @return {Promise} A Promise that resolves to the response of
   *   the request
   * @esi_link ContactsApi.getCharactersCharacterIdContactsLabels
   */
  labels() {
    return this._api.contacts(this._token)
    .newRequest('getCharactersCharacterIdContactsLabels', [this._id]);
  }

  _createContacts(contacts, standing, label, watched) {
    let opts = { watched: watched };
    if (label) {
      opts.label = label;
    }

    return this._api.contacts(this._token)
    .newRequest('postCharactersCharacterIdContacts',
        [this._id, contacts, standing], opts);
  };

  /**
   * Bulk add contacts with the same settings to the given character's contact
   * list via the ESI end point. This makes an HTTP POST request to
   * [`/characters/{characterId}/contacts`](https://esi.tech.ccp.is/latest/#!/Contacts/post_characters_character_id_contacts).
   * The request is returned as an asynchronous Promise that resolves to an
   * array from the response JSON model. An example return value looks like:
   *
   * ```
   * [
   *   123,
   *   456
   * ]
   * ```
   *
   * The added contacts are unwatched.
   *
   * @param {Array.<Number>} contacts Array of contact character ids to add
   * @param {Number} standing The standing for all contacts
   * @param {Number} label Optional; custom label id to add contacts to
   * @return {Promise} A Promise that resolves to the response of the request
   * @esi_link ContactsApi.postCharactersCharacterIdContacts
   */
  add(contacts, standing, label = 0) {
    return this._createContacts(contacts, standing, label, false);
  }

  /**
   * Equivalent to {@link Contacts#add add} except that the created contacts are
   * watched.
   *
   * @param {Array.<Number>} contacts Array of contact character ids to add
   * @param {Number} standing The standing for all contacts
   * @param {Number} label Optional; custom label id to add contacts to
   * @return {Promise} A Promise that resolves to the response of the request
   * @esi_link ContactsApi.postCharactersCharacterIdContacts
   */
  addWatched(contacts, standing, label = 0) {
    return this._createContacts(contacts, standing, label, true);
  }

  /**
   * Create a new Contact end point targeting the particular contact by
   * `id`.
   *
   * @param id {Number} The contact id
   * @returns {Contact}
   */
  get(id) {
    return new Contact(this, id);
  }
}

module.exports = Contacts;
