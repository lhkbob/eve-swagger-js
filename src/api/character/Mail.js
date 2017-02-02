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
   * Get the full mail message from the character's inbox via the ESI endpoint.
   * This makes an HTTP GET request to
   * [`/characters/{characterId}/mail/{mailId}/`](https://esi.tech.ccp.is/latest/#!/Mail/get_characters_character_id_mail_mail_id).
   * The request is returned as an asynchronous Promise that resolves to an
   * object parsed from the JSON model of the response. An example value is:
   *
   * ```
   * {
   *   "body": "blah blah blah",
   *   "from": 90000001,
   *   "labels": [
   *     2,
   *     32
   *   ],
   *   "read": false,
   *   "subject": "test",
   *   "timestamp": "2015-09-30T16:07:00Z"
   * }
   * ```
   *
   * @return {Promise} A Promise that resolves to the response of the request
   * @esi_link MailApi.getCharactersCharacterIdMailMailId
   */
  info() {
    return this._mail._api.mail(this._mail._token)
    .newRequest('getCharactersCharacterIdMailMailId',
        [this._mail._id, this._id]);
  }

  /**
   * Delete the given mail from the character's inbox via the ESI endpoint.
   * This
   * makes an HTTP DELETE request to
   * [`/characters/{characterId}/mail/{mailId}/`](https://esi.tech.ccp.is/latest/#!/Mail/delete_characters_character_id_mail_mail_id).
   * The request is returned as an asynchronous Promise that resolves to an
   * empty object on success.
   *
   * @return {Promise} A Promise that resolves to the response of the request
   * @esi_link MailApi.deleteCharactersCharacterIdMailMailId
   */
  del() {
    return this._mail._api.mail(this._mail._token)
    .newRequest('deleteCharactersCharacterIdMailMailId',
        [this._mail._id, this._id]);
  }

  /**
   * Update the metadata of a mail in the character's inbox via the ESI
   * endpoint. This makes an HTTP PUT request to
   * [`/characters/{characterId}/mail/{mailId}/`](https://esi.tech.ccp.is/latest/#!/Mail/put_characters_character_id_mail_mail_id).
   * The request is returned as an asynchronous Promise that resolves to an
   * empty object on success. The labels provided must correspond to label ids
   * returned by the character's inbox. The parameters to this function are
   * specified in a single object map.
   *
   * @param labels {Array.<Number>} Array of label ids to attach to the message
   * @param read {Boolean} True or false if the message is marked as read
   * @return {Promise} A Promise that resolves to the response of the request
   * @esi_link MailApi.putCharactersCharacterIdMailMailId
   */
  update({ labels: labels = [], read: read = true }) {
    return this._mail._api.mail(this._mail._token)
    .newRequest('putCharactersCharacterIdMailMailId', [
      this._mail._id, this._id, {
        labels: labels,
        read: read
      }
    ]);
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
   * Delete the label identified by `labelId` for the given `characterId`. This
   * makes an HTTP DELETE request to
   * [`/characters/{characterId}/mail/labels/{labelId}`](https://esi.tech.ccp.is/latest/#!/Mail/delete_characters_character_id_mail_labels_label_id).
   * The request is returned as an asynchronous Promise that resolves to an
   * empty object on success representing the new label's id.
   *
   * @return {Promise} A Promise that resolves to the response of the request
   * @esi_link MailApi.deleteCharactersCharacterIdMailLabelsLabelId
   */
  del() {
    return this._mail._api.mail(this._mail._token)
    .newRequest('deleteCharactersCharacterIdMailLabelsLabelId',
        [this._mail._id, this._id]);
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
   * Get the character's inbox labels along with unread counts for each label
   * and their total unread count for all mail. This makes an HTTP GET request
   * to
   * [`/characters/{id}/mail/labels/`](https://esi.tech.ccp.is/latest/#!/Mail/get_characters_character_id_mail_labels).
   * The request is returned as an asynchronous Promise that resolves to an
   * array parsed from the response JSON model. An example value looks like:
   *
   * ```
   * [
   *   {
   *     "color_hex": "#660066",
   *     "label_id": 16,
   *     "name": "PINK",
   *     "unread_count": 4
   *   },
   *   {
   *     "color_hex": "#ffffff",
   *     "label_id": 17,
   *     "name": "WHITE",
   *     "unread_count": 1
   *   }
   * ]
   * ```
   *
   * Note that the resolved array is the `labels` member of the actual ESI
   * response, stripping off the total unread count for simplicity.
   *
   * @return {Promise} A Promise that resolves to the response of
   *   the request
   * @esi_link MailApi.getCharactersCharacterIdMailLabels
   */
  all() {
    return this._mail._api.mail(this._mail._token)
    .newRequest('getCharactersCharacterIdMailLabels', [this._mail._id])
    .then(result => {
      return result.labels;
    });
  }

  /**
   * Create a new inbox label for the character. This makes an HTTP POST
   * request
   * to
   * [`/characters/{id}/mail/labels`](https://esi.tech.ccp.is/latest/#!/Mail/post_characters_character_id_mail_labels).
   * The request is returned as an asynchronous Promise that resolves to an
   * Integer on success representing the new label's id. The parameters to this
   * function are specified in a single object map.
   *
   * ```
   * {
   *   "color": "#ffffff",
   *   "name": "string"
   * }
   * ```
   *
   * @param name {String} The name of the new label
   * @param color {String} Optiona; a hex-encoded color, starting with `#`.
   *     Defaults to white.
   * @return {Promise} A Promise that resolves to the response of the request
   * @esi_link MailApi.postCharactersCharacterIdMailLabels
   */
  create({ name: name, color: color = '#ffffff' }) {
    return this._mail._api.mail(this._mail._token)
    .newRequest('postCharactersCharacterIdMailLabels', [this._mail._id], {
      label: {
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
   * @param api {ApiProvider} The api provider
   * @param characterId {Number} The id of the character whose mail is accessed
   * @param token {String} The SSO access token for the character
   * @constructor
   */
  constructor(api, characterId, token) {
    super(id => (id ? this.get(id) : this.inbox()));
    this._api = api;
    this._id = characterId;
    this._token = token;

    this._all = new MaxIdHandler(id => this.inbox([], id), m => m.mail_id, 50);
    this._labels = null;
  }

  /**
   * A Labels instance for this character, allowing access to the labels they
   * have created.
   *
   * @returns {Labels}
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
   * Get the total number of unread messages in the character's inbox, across
   * all labels. This makes an HTTP GET request to
   * [`/characters/{id}/mail/labels/`](https://esi.tech.ccp.is/latest/#!/Mail/get_characters_character_id_mail_labels)
   * and then filters the result to just return the total unread count as a
   * Number.
   *
   * @returns {Promise}
   */
  unreadCount() {
    return this._api.mail(this._token)
    .newRequest('getCharactersCharacterIdMailLabels', [this._id])
    .then(result => {
      return result.total_unread_count;
    });
  }

  /**
   * Calculate the CSPA mail prices for sending mail from the character to the
   * characters in `toIds`, via the ESI endpoint. This makes an HTTP POST
   * request to
   * [`/character/{id}/cspa/`](https://esi.tech.ccp.is/latest/#!/Character/post_characters_character_id_cspa).
   * The request is returned as an asynchronous Promise that resolves to an
   * object parsed from the response JSON model. An example value looks like:
   *
   * ```
   * {
   *   "cost": 295000
   * }
   * ```
   *
   * @param {Array.<Number>} toIds The list of character ids receiving the mail
   * @return {Promise} A Promise that resolves to the response of the request
   * @esi_link CharacterApi.postCharactersCharacterIdCspa
   */
  cspaCost(toIds) {
    return this._api.mail(this._token)
    .newRequest('postCharactersCharacterIdCspa', [this._id, toIds]);
  }

  /**
   * Get the 50 most recent mail headers in the characters inbox. If `labelIds`
   * is present, then only mail within those labels are returned. If
   * `lastMailId` is provided, up to the 50 mails just prior to that mail id
   * will be returned, allowing you to paginate backwards.
   *
   * This makes an HTTP GET request to
   * [`/characters/{id}/mail/`](https://esi.tech.ccp.is/latest/#!/Mail/get_characters_character_id_mail).
   * The request is returned as an asynchronous Promise that resolves to an
   * array parsed from the response JSON model. An example value looks like:
   *
   * ```
   * [
   *   {
   *     "from": 90000001,
   *     "is_read": true,
   *     "labels": [
   *       3
   *     ],
   *     "mail_id": 7,
   *     "recipients": [
   *       {
   *         "recipient_id": 90000002,
   *         "recipient_type": "character"
   *       }
   *     ],
   *     "subject": "Title for EVE Mail",
   *     "timestamp": "2015-09-30T16:07:00Z"
   *    }
   * ]
   * ```
   *
   * @param {Array.<Number>} labelIds Optional; the label ids to restrict
   *     returned mail to, or `[]` for no restriction.
   * @param {Number} lastMailId Optional mail id to constrain returned mail to
   *     have come prior to the given mail id
   * @return {Promise} A Promise that resolves to the response of the request
   * @esi_link MailApi.getCharactersCharacterIdMail
   */
  inbox(labelIds = [], lastMailId = 0) {
    let opts = {};
    if (labelIds) {
      opts['labels'] = labelIds;
    }
    if (lastMailId) {
      opts['last_mail_id'] = lastMailId;
    }

    return this._api.mail(this._token)
    .newRequest('getCharactersCharacterIdMail', [this._id], opts);
  };

  /**
   * Fetch all mails for the character as a single array. This makes multiple
   * calls to {@link Mail.inbox inbox}. Use with caution as certain characters
   * could have substantial amounts of mail.
   *
   * @returns {Promise}
   */
  all() {
    return this._all.getAll();
  }

  /**
   * Send a mail from the character, where the mail contents and destination
   * are
   * described by `mail`. This makes an HTTP POST request to
   * [`/characters/{id}/mail/`](https://esi.tech.ccp.is/latest/#!/Mail/post_characters_character_id_mail).
   * The request is returned as an asynchronous Promise that resolves to an
   * Integer holding the new mail id on success. An example `mail` value looks
   * like:
   *
   * ```
   * {
   *   "approved_cost": 0,
   *   "body": "string",
   *   "recipients": [
   *     {
   *       "recipient_id": 0,
   *       "recipient_type": "alliance"
   *     }
   *   ],
   *   "subject": "string"
   * }
   * ```
   *
   * @param {Object} mail The mail descriptor
   * @return {Promise} A Promise that resolves to the response of the request
   * @esi_link MailApi.postCharactersCharacterIdMail
   */
  send(mail) {
    return this._api.mail(this._token)
    .newRequest('postCharactersCharacterIdMail', [this._id, mail]);
  }

  /**
   * Get all of the character's mailing list memberships from the ESI end
   * point. This makes an HTTP GET request to
   * [`/characters/{id}/mail/lists/`](https://esi.tech.ccp.is/latest/#!/Mail/get_characters_character_id_mail_lists).
   * The request is returned as an asynchronous Promise that resolves to an
   * array parsed from the response JSON model. An example value looks like:
   *
   * ```
   * [
   *   {
   *     "mailing_list_id": 1,
   *     "name": "test_mailing_list"
   *   }
   * ]
   * ```
   *
   * @return {Promise} A Promise that resolves to the response of the request
   * @esi_link MailApi.getCharactersCharacterIdMailLists
   */
  lists() {
    return this._api.mail(this._token)
    .newRequest('getCharactersCharacterIdMailLists', [this._id]);
  }
}

module.exports = Mail;
