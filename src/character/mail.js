/**
 * A container for the [mail](https://esi.tech.ccp.is/latest/#/Mail)
 * ESI endpoints. You should not require this module directly, as it technically
 * returns a factory function that requires an internal API. Instead an instance
 * is automatically exposed when the 
 * {@link module:character} is loaded and configured.
 *
 * @see https://esi.tech.ccp.is/latest/#/Mail
 * @param api The internal API instance configured by the root module
 * @module character/mail
 */
 module.exports = function(api) {
    var newRequest = api.newRequest;
    var newRequestOpt = api.newRequestOpt;
    var ESI = api.esi;

    var exports = {};

    /**
     * Calculate the CSPA mail prices for sending mail from the character 
     * `fromId` to the characters in `toIds`, via the ESI endpoint. This makes
     * an HTTP POST request to [`/character/{fromId}/cspa/`](https://esi.tech.ccp.is/latest/#!/Character/post_characters_character_id_cspa).
     * The request is returned as an asynchronous Promise that resolves to 
     * an object parsed from the response JSON model. An example value looks 
     * like:
     * 
     * ```
     * {
     *   "cost": 295000
     * }
     * ```
     * @param {Integer} fromId The character id of the mail sender
     * @param {Array.<Integer>} toIds The list of character ids receiving the 
     *   mail
     * @param {String} accessToken Optiona; the access token to authenticate
     *   contact access of the sending character. If not provided, the default
     *   access token is used. This will fail if neither is available.
     * @return {external:Promise} A Promise that resolves to the response of
     *   the request
     * @see https://esi.tech.ccp.is/latest/#!/Character/post_characters_character_id_cspa
     * @esi_link CharacterApi.postCharactersCharacterIdCspa
     */
    exports.getCSPACost = function(fromId, toIds, accessToken) {
        return newRequest(ESI.CharacterApi, 'postCharactersCharacterIdCspa', 
                          [fromId, toIds], accessToken);
    };

    /**
     * Get the 50 most recent mail headers in the characters inbox. If
     * `labelIds` is present, then only mail within those labels are returned.
     * If `lastMailId` is provided, up to the 50 mails just prior to that 
     * mail id will be returned, allowing you to paginate backwards.
     * 
     * This makes an HTTP GET request to [`/characters/{id}/mail/`](https://esi.tech.ccp.is/latest/#!/Mail/get_characters_character_id_mail).
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
     * @param {Integer} id The character whose mail is fetched
     * @param {Array.<Integer>} labelIds The label ids to restrict returned 
     *   mail to, or `[]|null|undefined` for no restriction
     * @param {Integer} lastMailId Optional mail id to constrain returned mail
     *   to have come prior to the given mail id
     * @param {String} accessToken Optional access token to authenticate the
     *   request, which overrides any default access token of the factory. If
     *   neither this nor the default token are provided, this will fail.
     * @return {external:Promise} A Promise that resolves to the response of 
     *   the request
     * @see https://esi.tech.ccp.is/latest/#!/Mail/get_characters_character_id_mail
     * @esi_link MailApi.getCharactersCharacterIdMail
     */
    exports.getInbox = function(id, labelIds, lastMailId, accessToken) {
        opts = {};
        if (labelIds) {
            opts['labels'] = labelIds;
        }
        if (lastMailId) {
            opts['last_mail_id'] = lastMailId;
        }
        return newRequestOpt(ESI.MailApi, 'getCharactersCharacterIdMail',
                             [id], opts, accessToken);
    };

    /**
     * Send a mail from the given character `id`, where the mail contents
     * and destination are described by `mail`. This makes an HTTP POST request
     * to [`/characters/{id}/mail/`](https://esi.tech.ccp.is/latest/#!/Mail/post_characters_character_id_mail).
     * The request is returned as an asynchronous Promise that resolves to 
     * an Integer holding the new mail id on success. An example `mail` value 
     * looks like:
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
     * @param {Integer} id The character id sending the mail
     * @param {Object} mail The mail descriptor
     * @param {String} accessToken Optional access token to authenticate the
     *   request, which overrides any default access token of the factory. If
     *   neither this nor the default token are provided, this will fail.
     * @return {external:Promise} A Promise that resolves to the response of 
     *   the request
     * @see https://esi.tech.ccp.is/latest/#!/Mail/post_characters_character_id_mail
     * @esi_link MailApi.postCharactersCharacterIdMail
     */
    exports.send = function(id, mail, accessToken) {
        return newRequest(ESI.MailApi, 'postCharactersCharacterIdMail',
                          [id, mail], accessToken);
    };

    /**
     * Get the character's inbox labels along with unread counts for each label
     * and their total unread count for all mail. This makes an HTTP GET request
     * to [`/characters/{id}/mail/labels/`](https://esi.tech.ccp.is/latest/#!/Mail/get_characters_character_id_mail_labels).
     * The request is returned as an asynchronous Promise that resolves to an
     * object parsed from the response JSON model. An example value looks like:
     * 
     * ```
     * {
     *   "labels": [
     *     {
     *       "color_hex": "#660066",
     *       "label_id": 16,
     *       "name": "PINK",
     *       "unread_count": 4
     *     },
     *     {
     *       "color_hex": "#ffffff",
     *       "label_id": 17,
     *       "name": "WHITE",
     *       "unread_count": 1
     *     }
     *   ],
     *   "total_unread_count": 5
     * }
     * ```
     * @param {Integer} id The character id to fetch mail for
     * @param {String} accessToken Optional access token to authenticate the
     *   request, which overrides any default access token of the factory. If
     *   neither this nor the default token are provided, this will fail.
     * @return {external:Promise} A Promise that resolves to the response of 
     *   the request
     * @see https://esi.tech.ccp.is/latest/#!/Mail/get_characters_character_id_mail_labels
     * @esi_link MailApi.getCharactersCharacterIdMailLabels
     */
    exports.getInboxLabels = function(id, accessToken) {
        return newRequest(ESI.MailApi, 'getCharactersCharacterIdMailLabels',
                          [id], accessToken);
    };

    /**
     * Create a new inbox label for the given character `id`. This makes an HTTP POST request to
     * [`/characters/{id}/mail/labels`](https://esi.tech.ccp.is/latest/#!/Mail/post_characters_character_id_mail_labels).
     * The request is returned as an asynchronous Promise that resolves to 
     * an Integer on success representing the new label's id. An example `label` 
     * value looks like:
     * 
     * ```
     * {
     *   "color": "#ffffff",
     *   "name": "string"
     * }
     * ```
     * @param {Integer} id The character id the label is created for
     * @param {Object} label The label descriptor
     * @param {String} accessToken Optional access token to authenticate the
     *   request, which overrides any default access token of the factory. If
     *   neither this nor the default token are provided, this will fail.
     * @return {external:Promise} A Promise that resolves to the response of 
     *   the request
     * @see https://esi.tech.ccp.is/latest/#!/Mail/post_characters_character_id_mail_labels
     * @esi_link MailApi.postCharactersCharacterIdMailLabels
     */
    exports.addInboxLabel = function(id, label, accessToken) {
        return newRequestOpt(ESI.MailApi, 'postCharactersCharacterIdMailLabels',
                          [id], {label: label}, accessToken);
    };

   /**
    * Delete the label identified by `labelId` for the given `characterId`. This makes an HTTP DELETE request to
    * [`/characters/{characterId}/mail/labels/{labelId}`](https://esi.tech.ccp.is/latest/#!/Mail/delete_characters_character_id_mail_labels_label_id).
    * The request is returned as an asynchronous Promise that resolves to
    * an empty object on success representing the new label's id.
    *
    * @param {Integer} characterId The character id the whose mailbox has the label deleted from
    * @param {Object} labelId The label's id
    * @param {String} accessToken Optional access token to authenticate the
    *   request, which overrides any default access token of the factory. If
    *   neither this nor the default token are provided, this will fail.
    * @return {external:Promise} A Promise that resolves to the response of
    *   the request
    * @see https://esi.tech.ccp.is/latest/#!/Mail/delete_characters_character_id_mail_labels_label_id
    * @esi_link MailApi.deleteCharactersCharacterIdMailLabelsLabelId
    */
   exports.deleteInboxLabel = function(characterId, labelId, accessToken) {
     return newRequestOpt(ESI.MailApi, 'deleteCharactersCharacterIdMailLabelsLabelId',
       [id], {label: label}, accessToken);
   };

    /**
     * Get all of the the character's mailing list memberships from the ESI 
     * end point. This makes an HTTP GET request to
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
     * @param {Integer} id The character id the label is created for
     * @param {String} accessToken Optional access token to authenticate the
     *   request, which overrides any default access token of the factory. If
     *   neither this nor the default token are provided, this will fail.
     * @return {external:Promise} A Promise that resolves to the response of 
     *   the request
     * @see https://esi.tech.ccp.is/latest/#!/Mail/get_characters_character_id_mail_lists
     * @esi_link MailApi.getCharactersCharacterIdMailLists
     */
    exports.getMailingLists = function(id, accessToken) {
        return newRequest(ESI.MailApi, 'getCharactersCharacterIdMailLists',
                          [id], accessToken);
    };

    /**
     * Delete the given mail from the character's inbox via the ESI endpoint.
     * This makes an HTTP DELETE request to 
     * [`/characters/{characterId}/mail/{mailId}/`](https://esi.tech.ccp.is/latest/#!/Mail/delete_characters_character_id_mail_mail_id).
     * The request is returned as an asynchronous Promise that resolves to an
     * empty object on success.
     *
     * @param {Integer} characterId The character id whose mail is deleted
     * @param {Integer} mailId The particular mail to delete
     * @param {String} accessToken Optional access token to authenticate the
     *   request, which overrides any default access token of the factory. If
     *   neither this nor the default token are provided, this will fail.
     * @return {external:Promise} A Promise that resolves to the response of 
     *   the request 
     * @see https://esi.tech.ccp.is/latest/#!/Mail/delete_characters_character_id_mail_mail_id
     * @esi_link MailApi.deleteCharactersCharacterIdMailMailId
     */
    exports.delete = function(characterId, mailId, accessToken) {
        return newRequest(ESI.MailApi, 'deleteCharactersCharacterIdMailMailId',
                          [characterId, mailId], accessToken);
    };

    /**
     * Get the full mail message from the character's inbox via the ESI 
     * endpoint. This makes an HTTP GET request to 
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
     * @param {Integer} characterId The character id whose mail is fetched
     * @param {Integer} mailId The particular mail to fetch
     * @param {String} accessToken Optional access token to authenticate the
     *   request, which overrides any default access token of the factory. If
     *   neither this nor the default token are provided, this will fail.
     * @return {external:Promise} A Promise that resolves to the response of 
     *   the request 
     * @see https://esi.tech.ccp.is/latest/#!/Mail/get_characters_character_id_mail_mail_id
     * @esi_link MailApi.getCharactersCharacterIdMailMailId
     */
    exports.get = function(characterId, mailId, accessToken) {
        return newReqest(ESI.MailApi, 'getCharactersCharacterIdMailMailId',
                         [characterId, mailId], accessToken);
    };

    /**
     * Update the metadata of a mail in the character's inbox via the ESI 
     * endpoint. This makes an HTTP PUT request to 
     * [`/characters/{characterId}/mail/{mailId}/`](https://esi.tech.ccp.is/latest/#!/Mail/put_characters_character_id_mail_mail_id).
     * The request is returned as an asynchronous Promise that resolves to an
     * empty object on success. An example `updates` object looks like:
     *
     * ```
     * {
     *   "labels": [
     *     0
     *   ],
     *   "read": true
     * }
     * ```
     *
     * @param {Integer} characterId The character id whose mail is updated
     * @param {Integer} mailId The particular mail to update
     * @param {Object} updates Update description object
     * @param {String} accessToken Optional access token to authenticate the
     *   request, which overrides any default access token of the factory. If
     *   neither this nor the default token are provided, this will fail.
     * @return {external:Promise} A Promise that resolves to the response of 
     *   the request 
     * @see https://esi.tech.ccp.is/latest/#!/Mail/put_characters_character_id_mail_mail_id
     * @esi_link MailApi.putCharactersCharacterIdMailMailId
     */
    exports.update = function(characterId, mailId, updates, accessToken) {
        return newReqest(ESI.MailApi, 'putCharactersCharacterIdMailMailId',
                         [characterId, mailId, updates], accessToken);
    };

    return exports;
};
