const ExtendableFunction = require('../../internal/ExtendableFunction');
const [, MaxIdHandler] = require('../../internal/PageHandler');

/**
 * An api adapter over the end points handling a specific message in a
 * character's inbox via functions in the
 * [mail](https://esi.tech.ccp.is/latest/#/Mail) ESI endpoints. You should not
 * usually instantiate this directly as its constructor requires an internal api
 * instance.
 */
class Message {
  /**
   * Create a new Message adaptor owned by the given `mail` corresponding to the
   * given `messageId`.
   *
   * @param mail {Mail} The owning fleet
   * @param messageId {Number} The message id of this instance
   * @constructor
   */
  constructor(mail, messageId) {
    this._mail = mail;
    this._id = messageId;
  }

  /**
   * @esi_route get_characters_character_id_mail_mail_id
   * @esi_example esi.characters(1, 'token').mail(2).info()
   *
   * @returns {Promise.<Object>}
   */
  info() {
    return this._mail._agent.auth(this._mail._token)
    .get('/v1/characters/{character_id}/mail/{mail_id}/', {
      path: {
        'character_id': this._mail._id,
        'mail_id': this._id
      }
    });
  }

  /**
   * @esi_route delete_characters_character_id_mail_mail_id
   * @esi_example esi.characters(1, 'token').mail(2).del()
   *
   * @returns {Promise.<Object>}
   */
  del() {
    return this._mail._agent.auth(this._mail._token)
    .del('/v1/characters/{character_id}/mail/{mail_id}/', {
      path: {
        'character_id': this._mail._id,
        'mail_id': this._id
      }
    });
  }

  /**
   * @esi_route put_characters_character_id_mail_mail_id
   * @esi_param contents - {labels, read}
   * @esi_example esi.characters(1, 'token').mail(2).update({...})
   *
   * @param labels {Array.<Number>} Array of label ids to attach to the message
   * @param read {Boolean} True or false if the message is marked as read
   * @return {Promise.<Object>}
   */
  update({ labels: labels = [], read: read = true }) {
    return this._mail._agent.auth(this._mail._token)
    .put('/v1/characters/{character_id}/mail/{mail_id}/', {
      path: {
        'character_id': this._mail._id,
        'mail_id': this._id
      },
      body: {
        labels: labels,
        read: read
      }
    });
  }
}

/**
 * An api adapter over the end points handling a specific label in a
 * character's inbox via functions in the
 * [mail](https://esi.tech.ccp.is/latest/#/Mail) ESI endpoints. You should not
 * usually instantiate this directly as its constructor requires an internal api
 * instance.
 */
class Label {
  /**
   * Create a new Label adaptor owned by the given `mail` corresponding to the
   * given `labelId`.
   *
   * @param mail {Mail} The owning fleet
   * @param labelId {Number} The label id of this instance
   * @constructor
   */
  constructor(mail, labelId) {
    this._mail = mail;
    this._id = labelId;
  }

  /**
   * @esi_route delete_characters_character_id_mail_labels_label_id
   * @esi_example esi.characters(1, 'token').mail.labels(2).del()
   *
   * @returns {Promise.<Object>}
   */
  del() {
    return this._mail._agent.auth(this._mail._token)
    .del('/v1/characters/{character_id}/mail/labels/{label_id}/', {
      path: {
        'character_id': this._mail._id,
        'label_id': this._id
      }
    });
  }
}

/**
 * An api adapter over the end points handling all labels in the character's
 * inbox via functions in the [mail](https://esi.tech.ccp.is/latest/#/Mail) ESI
 * endpoints. You should not usually instantiate this directly as its
 * constructor requires an internal api instance.
 *
 * This is a function class so instances of `Labels` are functions and can be
 * invoked directly, besides accessing its members. Its default function action
 * is equivalent to {@link Labels#get get} or {@link Labels#all all} if no id is
 * given.
 */
class Labels extends ExtendableFunction {
  /**
   * Create a new Labels function owned by the given `mail`.
   *
   * @param mail {Mail} The owning mail
   * @constructor
   */
  constructor(mail) {
    super(id => (id ? this.get(id) : this.all()));
    this._mail = mail;
  }

  /**
   * Get a Label instance corresponding to the given label `id`.
   * @param id The label id
   * @returns {Label}
   */
  get(id) {
    return new Label(this._mail, id);
  }

  /**
   * @esi_route get_characters_character_id_mail_labels
   * @esi_returns labels
   * @esi_example esi.characters(1, 'token').mail.labels()
   *
   * @returns {Promise.<Array.<Object>>}
   */
  all() {
    return this._mail._agent.auth(this._mail._token)
    .get('/v3/characters/{character_id}/mail/labels/', {
      path: {
        'character_id': this._mail._id,
      }
    }).then(result => {
      return result.labels;
    });
  }

  /**
   * @esi_route post_characters_character_id_mail_labels
   * @esi_param label - {name, color}
   * @esi_example esi.characters(1, 'token').mail.labels.add({...})
   *
   * @param name {String}
   * @param color {String} Defaults to white.
   * @returns {Promise.<Number>}
   */
  add({ name: name, color: color = '#ffffff' }) {
    return this._mail._agent.auth(this._mail._token)
    .post('/v2/characters/{character_id}/mail/labels/', {
      path: {
        'character_id': this._mail._id,
      },
      body: {
        name: name,
        color: color
      }
    });
  }
}

/**
 * An api adapter over the end points handling the mail inbox for a character
 * via functions in the [mail](https://esi.tech.ccp.is/latest/#/Mail) ESI
 * endpoints. You should not usually instantiate this directly as its
 * constructor requires an internal api instance.
 *
 * This is a function class so instances of `Mail` are functions and can be
 * invoked directly, besides accessing its members. Its default function action
 * is equivalent to {@link Mail#get get} or {@link Mail#inbox inbox} if no id is
 * given.
 */
class Mail extends ExtendableFunction {
  /**
   * Create a new Mail function for the character, including its SSO token.
   *
   * @param agent {ESIAgent} The ESI agent
   * @param characterId {Number} The id of the character whose mail is accessed
   * @param token {String} The SSO access token for the character
   * @constructor
   */
  constructor(agent, characterId, token) {
    super(id => (id ? this.get(id) : this.inbox()));
    this._agent = agent;
    this._id = characterId;
    this._token = token;

    this._all = new MaxIdHandler(id => this.inbox([], id), m => m.mail_id, 50);
    this._labels = null;
  }

  /**
   * A Labels instance for this character, allowing access to the labels they
   * have created.
   *
   * @type {Labels}
   */
  get labels() {
    if (!this._labels) {
      this._labels = new Labels(this);
    }
    return this._labels;
  }

  /**
   * Get a Message instance for the given message or mail id.
   *
   * @param id The message id
   * @returns {Message}
   */
  get(id) {
    return new Message(this, id);
  }

  /**
   * This makes a request to the `labels` route and then filters the result
   * to just return the total unread count.
   *
   * @esi_route get_characters_character_id_mail_labels
   * @esi_returns total_unread_count
   * @esi_example esi.characters(1, 'token').mail.unreadCount()
   *
   * @returns {Promise.<Number>}
   */
  unreadCount() {
    return this._agent.auth(this._token)
    .get('/v3/characters/{character_id}/mail/labels/', {
      path: {
        'character_id': this._id,
      }
    }).then(result => {
      return result.total_unread_count;
    });
  }

  /**
   * @esi_route post_characters_character_id_cspa
   * @esi_param characters - {characters: toIds}
   * @esi_returns cost
   * @esi_example esi.characters(1, 'token').mail.cspaCost()
   *
   * @param toIds {Array.<Number>}
   * @returns {Promise.<Number>}
   */
  cspaCost(toIds) {
    return this._agent.auth(this._token)
    .post('/v3/characters/{character_id}/cspa/', {
      path: { 'character_id': this._id },
      body: { 'characters': toIds }
    });
  }

  /**
   * @esi_route get_characters_character_id_mail
   * @esi_param labels - labelIds
   * @esi_example esi.characters(1, 'token').mail()
   *
   * @param labelIds {Array.<Number>} If empty, no filtering is performed.
   * @param lastMailId {Number} If `0`, the most recent mails are returned.
   * @returns {Promise.<Array.<Object>>}
   */
  inbox(labelIds = [], lastMailId = 0) {
    let opts = {};
    if (labelIds) {
      opts['labels'] = labelIds;
    }
    if (lastMailId) {
      opts['last_mail_id'] = lastMailId;
    }

    return this._agent.auth(this._token)
    .get('/v1/characters/{character_id}/mail/', {
      path: { 'character_id': this._id },
      query: {
        'labels': !labelIds || labelIds.length == 0 ? null : labelIds,
        'last_mail_id': lastMailId == 0 ? null : lastMailId
      }
    });
  };

  /**
   * Fetch all mails for the character as a single array. This makes multiple
   * calls to {@link Mail.inbox inbox}. Use with caution as certain characters
   * could have substantial amounts of mail.
   *
   * @returns {Promise.<Array.<Object>>}
   */
  all() {
    return this._all.getAll();
  }

  /**
   * @esi_route post_characters_character_id_mail
   * @esi_example esi.characters(1, 'token').mail.send({...})
   *
   * @param {Object} mail The mail descriptor
   * @return {Promise.<Number>}
   */
  send(mail) {
    return this._agent.auth(this._token)
    .post('/v1/characters/{character_id}/mail/', {
      path: { 'character_id': this._id },
      body: mail
    });
  }

  /**
   * @esi_route get_characters_character_id_mail_lists
   * @esi_example esi.characters(1, 'token').mail.lists()
   *
   * @returns {Promise.<Array.<Object>>}
   */
  lists() {
    return this._agent.auth(this._token)
    .get('/v1/characters/{character_id}/mail/lists/',
        { path: { 'character_id': this._id } });
  }
}

module.exports = Mail;
