"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const page_loader_1 = require("../../internal/page-loader");
/**
 * Create a new {@link Mail} instance that uses the given character agent to
 * make its HTTP requests to the ESI interface.
 *
 * @param char The character access information
 * @returns An Mail API instance
 */
function makeMail(char) {
    let mail = function (messageIDorLabels, lastMailId) {
        // Matching to the inbox function when the second argument exists (since
        // 2nd function only takes 1 argument), or if the first argument is an
        // array or undefined.
        if (messageIDorLabels === undefined || Array.isArray(messageIDorLabels)
            || lastMailId !== undefined) {
            return char.agent.request('get_characters_character_id_mail', {
                path: { character_id: char.id },
                query: { labels: messageIDorLabels, last_mail_id: lastMailId }
            }, char.ssoToken);
        }
        else {
            return new MessageImpl(char, messageIDorLabels);
        }
    };
    let allMail = page_loader_1.makeIDBasedLoader(maxID => mail(undefined, maxID), item => item.mail_id, 50);
    mail.all = function () {
        return allMail.getAll();
    };
    mail.labels = makeLabels(char);
    mail.unreadCount = function () {
        return char.agent.request('get_characters_character_id_mail_labels', { path: { character_id: char.id } }, char.ssoToken)
            .then(result => result.total_unread_count || 0);
    };
    mail.cspaCost = function (to) {
        return char.agent.request('post_characters_character_id_cspa', { path: { character_id: char.id }, body: { characters: to } }, char.ssoToken).then(result => result.cost || 0);
    };
    mail.send = function (mail) {
        return char.agent.request('post_characters_character_id_mail', { path: { character_id: char.id }, body: mail }, char.ssoToken);
    };
    mail.lists = function () {
        return char.agent.request('get_characters_character_id_mail_lists', { path: { character_id: char.id } }, char.ssoToken);
    };
    return mail;
}
exports.makeMail = makeMail;
class MessageImpl {
    constructor(char, id_) {
        this.char = char;
        this.id_ = id_;
    }
    info() {
        return this.char.agent.request('get_characters_character_id_mail_mail_id', { path: { character_id: this.char.id, mail_id: this.id_ } }, this.char.ssoToken);
    }
    del() {
        return this.char.agent.request('delete_characters_character_id_mail_mail_id', { path: { character_id: this.char.id, mail_id: this.id_ } }, this.char.ssoToken);
    }
    update(state) {
        return this.char.agent.request('put_characters_character_id_mail_mail_id', {
            path: { character_id: this.char.id, mail_id: this.id_ },
            body: state
        }, this.char.ssoToken);
    }
    id() {
        return Promise.resolve(this.id_);
    }
}
class LabelImpl {
    constructor(char, id_) {
        this.char = char;
        this.id_ = id_;
    }
    del() {
        return this.char.agent.request('delete_characters_character_id_mail_labels_label_id', { path: { character_id: this.char.id, label_id: this.id_ } }, this.char.ssoToken);
    }
    id() {
        return Promise.resolve(this.id_);
    }
}
function makeLabels(char) {
    let labels = function (id) {
        if (id === undefined) {
            return char.agent.request('get_characters_character_id_mail_labels', { path: { character_id: char.id } }, char.ssoToken)
                .then(result => result.labels);
        }
        else {
            return new LabelImpl(char, id);
        }
    };
    labels.add = function (settings) {
        return char.agent.request('post_characters_character_id_mail_labels', { path: { character_id: char.id }, body: settings }, char.ssoToken);
    };
    return labels;
}
//# sourceMappingURL=mail.js.map