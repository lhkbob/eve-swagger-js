"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const page_loader_1 = require("../../internal/page-loader");
/**
 * Create a new {@link Contacts} instance that uses the given character agent to
 * make its HTTP requests to the ESI interface.
 *
 * @param char The character access information
 * @returns An Contacts API instance
 */
function makeContacts(char) {
    function addContacts(watched, ids, standing, labelID) {
        return char.agent.request('post_characters_character_id_contacts', {
            path: { character_id: char.id },
            query: { watched: watched, standing: standing, label_id: labelID },
            body: ids
        }, char.ssoToken);
    }
    const allContacts = page_loader_1.makePageBasedLoader(page => char.agent.request('get_characters_character_id_contacts', { path: { character_id: char.id }, query: { page: page } }, char.ssoToken));
    let contacts = function (id) {
        if (id === undefined) {
            return allContacts.getAll();
        }
        else {
            return new ContactImpl(char, id);
        }
    };
    contacts.labels = function () {
        return char.agent.request('get_characters_character_id_contacts_labels', { path: { character_id: char.id } }, char.ssoToken);
    };
    contacts.add = function (ids, standing, labelID) {
        return addContacts(false, ids, standing, labelID);
    };
    contacts.addWatched = function (ids, standing, labelID) {
        return addContacts(true, ids, standing, labelID);
    };
    return contacts;
}
exports.makeContacts = makeContacts;
class ContactImpl {
    constructor(char, id_) {
        this.char = char;
        this.id_ = id_;
    }
    del() {
        return this.char.agent.request('delete_characters_character_id_contacts', {
            path: { character_id: this.char.id }, body: [this.id_]
        }, this.char.ssoToken);
    }
    updateContact(watched, standing, label) {
        return this.char.agent.request('put_characters_character_id_contacts', {
            path: { character_id: this.char.id }, query: {
                label_id: label, standing: standing, watched: watched
            }, body: [this.id_]
        }, this.char.ssoToken);
    }
    update(standing, label) {
        return this.updateContact(false, standing, label);
    }
    updateWatched(standing, label) {
        return this.updateContact(true, standing, label);
    }
    id() {
        return Promise.resolve(this.id_);
    }
}
//# sourceMappingURL=contacts.js.map