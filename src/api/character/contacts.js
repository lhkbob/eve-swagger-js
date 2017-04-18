const CallableInstance = require('../../internal/callable-instance');
const [PageHandler,] = require('../../internal/page-handler');

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
   * @esi_example esi.characters(1, 'token').contacts(2).del()
   *
   * @returns {Promise.<Object>}
   */
  del() {
    return this._contacts._agent.auth(this._contacts._token)
    .del('/v1/characters/{character_id}/contacts/', {
      path: { 'character_id': this._contacts._id },
      body: [this._id]
    });
  }

  _updateContact(standing, label, watched) {
    return this._contacts._agent.auth(this._contacts._token)
    .put('/v1/characters/{character_id}/contacts/', {
      path: { 'character_id': this._contacts._id },
      query: {
        'label_id': label,
        'standing': standing,
        'watched': watched
      },
      body: [this._id]
    });
  }

  /**
   * @esi_route put_characters_character_id_contacts
   * @esi_param watched - false
   * @esi_param !contact_ids
   * @esi_param label_id - label
   *
   * @esi_example esi.characters(1, 'token').contacts(2).update({...})
   *
   * @param standing {Number}
   * @param label {Number}
   *
   * @returns {Promise.<Object>}
   */
  update({ standing: standing, label: label = 0 }) {
    return this._updateContact(standing, label, false);
  }

  /**
   * @esi_route put_characters_character_id_contacts
   * @esi_param watched - true
   * @esi_param !contact_ids
   * @esi_param label_id - label
   *
   * @esi_example esi.characters(1, 'token').contacts(2).updateWatched({...})
   *
   * @param standing {Number}
   * @param label {Number}
   *
   * @returns {Promise.<Object>}
   */
  updateWatched({ standing: standing, label: label = 0 }) {
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
class Contacts extends CallableInstance {
  /**
   * Create a new Contacts function using the given `agent`, for the
   * character described by `characterId` with SSO access from `token`.
   *
   * @param agent {ESIAgent} The ESI agent
   * @param characterId {Number} The character id whose contacts are accessed
   * @param token {String} The SSO access token for the character
   * @constructor
   */
  constructor(agent, characterId, token) {
    super(id => (id ? this.get(id) : this.all()));

    this._agent = agent;
    this._id = characterId;
    this._token = token;
    this._all = new PageHandler(page => this.all(page));
  }

  /**
   * @esi_route get_characters_character_id_contacts
   * @esi_example esi.characters(1, 'token').contacts()
   *
   * @param page {Number} If `0`, all pages are returned, concatenated into a
   *     single array.
   * @returns {Promise.<Array.<Object>>}
   */
  all(page = 0) {
    if (page == 0) {
      return this._all.getAll();
    } else {
      return this._agent.auth(this._token)
      .get('/v1/characters/{character_id}/contacts/', {
        path: { 'character_id': this._id },
        query: { 'page': page }
      });
    }
  }

  /**
   * @esi_route get_characters_character_id_contacts_labels
   * @esi_example esi.characters(1, 'token').contacts.labels()
   *
   * @returns {Promise.<Array.<Object>>}
   */
  labels() {
    return this._agent.auth(this._token)
    .get('/v1/characters/{character_id}/contacts/labels/',
        { path: { 'character_id': this._id } });
  }

  _createContacts(contacts, standing, label, watched) {
    return this._agent.auth(this._token)
    .post('/v1/characters/{character_id}/contacts/', {
      path: { 'character_id': this._id },
      query: {
        'label_id': label,
        'standing': standing,
        'watched': watched
      },
      body: contacts
    });
  };

  /**
   * @esi_route post_characters_character_id_contacts
   * @esi_param watched - false
   * @esi_param label_id - label
   * @esi_param contact_ids - ids
   *
   * @esi_example esi.characters(1, 'token').contacts.add({...})
   *
   * @param ids {Array.<Number>}
   * @param standing {Number}
   * @param label {Number}
   *
   * @returns {Promise.<Array.<Number>>}
   */
  add({ ids: ids, standing: standing, label: label = 0 }) {
    return this._createContacts(ids, standing, label, false);
  }

  /**
   * @esi_route post_characters_character_id_contacts
   * @esi_param watched - true
   * @esi_param label_id - label
   * @esi_param contact_ids - ids
   *
   * @esi_example esi.characters(1, 'token').contacts.addWatched({...})
   *
   * @param ids {Array.<Number>}
   * @param standing {Number}
   * @param label {Number}
   *
   * @returns {Promise.<Array.<Number>>}
   */
  addWatched({ ids: ids, standing: standing, label: label = 0 }) {
    return this._createContacts(ids, standing, label, true);
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
