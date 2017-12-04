"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const batch_1 = require("../../internal/batch");
const r = require("../../internal/resource-api");
const DELETE_CONTACTS_BATCH_SIZE = 100;
const PUT_CONTACTS_BATCH_SIZE = 100;
const ADD_CONTACTS_BATCH_SIZE = 100;
/**
 * An api adapter for accessing various details of a single contact,
 * specified by a provided contact id when the api is instantiated.
 */
class Contact extends r.impl.SimpleResource {
    constructor(agent, id) {
        super(id);
        this.agent = agent;
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
    del() {
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
    update(standing, label = 0, watched = false) {
        return updateContacts(this.agent, [this.id_], standing, label, watched)
            .then(ids => undefined);
    }
}
exports.Contact = Contact;
/**
 * An api adapter for accessing various details of multiple contact ids,
 * specified by a provided an array or set of ids when the api is instantiated.
 */
class MappedContacts extends r.impl.SimpleMappedResource {
    constructor(agent, ids) {
        super(ids);
        this.agent = agent;
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
            .then(ids => r.impl.filterIteratedToMap(this.contacts_(), ids, e => e.contact_id));
    }
    /**
     * Delete the specific contacts for the character.
     *
     * @esi_route delete_characters_character_id_contacts
     *
     * @returns An empty promise that resolves after the contacts have been
     *     deleted
     */
    del() {
        // Discard the map from id to undefined after they have completed
        return this.arrayIDs()
            .then(ids => batch_1.getBatchedValues(ids, idSet => deleteContacts(this.agent, idSet), id => [id, undefined], DELETE_CONTACTS_BATCH_SIZE))
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
    update(standing, label = 0, watched = false) {
        // Discard the map from id to undefined after they have completed
        return this.arrayIDs()
            .then(ids => batch_1.getBatchedValues(ids, idSet => updateContacts(this.agent, idSet, standing, label, watched), id => [id, undefined], PUT_CONTACTS_BATCH_SIZE))
            .then(map => undefined);
    }
}
exports.MappedContacts = MappedContacts;
/**
 * An api adapter for accessing various details about every contact registered
 * to the character.
 */
class IteratedContacts extends r.impl.SimpleIteratedResource {
    constructor(agent) {
        super(getContacts(agent), e => e.contact_id);
        this.agent = agent;
    }
    /**
     * @returns The contact details for every contact of the character
     */
    details() {
        return this.getPaginatedResource();
    }
}
exports.IteratedContacts = IteratedContacts;
/**
 * Create a new {@link Contacts} instance that uses the given character agent to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The character access information
 * @returns An Contacts API instance
 */
function makeContacts(agent) {
    let contacts = function (ids) {
        if (ids === undefined) {
            // All contacts
            return new IteratedContacts(agent);
        }
        else if (typeof ids === 'number') {
            // Single contact
            return new Contact(agent, ids);
        }
        else {
            // Multiple contacts
            return new MappedContacts(agent, ids);
        }
    };
    contacts.labels = function () {
        return agent.agent.request('get_characters_character_id_contacts_labels', { path: { character_id: agent.id } }, agent.ssoToken);
    };
    contacts.add = function (ids, standing, label = 0, watched = false) {
        return batch_1.getBatchedValues(ids, idSet => addContacts(agent, idSet, standing, label, watched), (e, id) => [id, e], ADD_CONTACTS_BATCH_SIZE);
    };
    return contacts;
}
exports.makeContacts = makeContacts;
function getContactsPage(agent, page) {
    return agent.agent.request('get_characters_character_id_contacts', { path: { character_id: agent.id }, query: { page: page } }, agent.ssoToken).then(result => ({ result, maxPages: undefined }));
}
function getContacts(agent) {
    return r.impl.makePageBasedStreamer(page => getContactsPage(agent, page));
}
function addContacts(agent, contacts, standing, label, watched) {
    return agent.agent.request('post_characters_character_id_contacts', {
        path: { character_id: agent.id },
        query: { standing: standing, label_id: label, watched: watched },
        body: contacts
    }, agent.ssoToken);
}
function deleteContacts(agent, contacts) {
    return agent.agent.request('delete_characters_character_id_contacts', { path: { character_id: agent.id }, body: contacts })
        .then(() => contacts);
}
function updateContacts(agent, contacts, standing, label, watched) {
    return agent.agent.request('put_characters_character_id_contacts', {
        path: { character_id: agent.id },
        query: { label_id: label, standing: standing, watched: watched },
        body: contacts
    }, agent.ssoToken).then(() => contacts);
}
//# sourceMappingURL=contacts.js.map