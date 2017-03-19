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
   * @esi_route delete_characters_character_id_contacts
   * @esi_param !contact_ids
   *
   * @returns {Promise.<Object>}
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
   * @esi_route put_characters_character_id_contacts
   * @esi_param watched - false
   * @esi_param !contact_ids
   * @esi_param label_id - label
   *
   * @param standing {Number}
   * @param label {Number}
   *
   * @returns {Promise.<Object>}
   */
  update(standing, label = 0) {
    return this._updateContact(standing, label, false);
  }

  /**
   * @esi_route put_characters_character_id_contacts
   * @esi_param watched - true
   * @esi_param !contact_ids
   * @esi_param label_id - label
   *
   * @param standing {Number}
   * @param label {Number}
   *
   * @returns {Promise.<Object>}
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
   * @esi_route get_characters_character_id_contacts
   *
   * @param page {Number} If `0`, all pages are returned, concatenated into a
   *     single array.
   * @returns {Promise.<Array.<Object>>}
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
   * @esi_route get_characters_character_id_contacts_labels
   *
   * @returns {Promise.<Array.<Object>>}
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
   * @esi_route post_characters_character_id_contacts
   * @esi_param watched - false
   * @esi_param label_id - label
   * @esi_param contact_ids - contacts
   *
   *
   * @param contacts {Array.<Number>}
   * @param standing {Number}
   * @param label {Number}
   *
   * @returns {Promise.<Array.<Number>>}
   */
  add(contacts, standing, label = 0) {
    return this._createContacts(contacts, standing, label, false);
  }

  /**
   * @esi_route post_characters_character_id_contacts
   * @esi_param watched - true
   * @esi_param label_id - label
   * @esi_param contact_ids - contacts
   *
   * @param contacts {Array.<Number>}
   * @param standing {Number}
   * @param label {Number}
   *
   * @returns {Promise.<Array.<Number>>}
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
