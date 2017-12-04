"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncIterator) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator];
    return m ? m.call(o) : typeof __values === "function" ? __values(o) : o[Symbol.iterator]();
};
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);  }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const r = require("../../internal/resource-api");
/**
 * An api adapter for accessing various details of a single message,
 * specified by a provided mail id when the api is instantiated.
 */
class Message extends r.impl.SimpleResource {
    constructor(agent, id) {
        super(id);
        this.agent = agent;
    }
    /**
     * @returns The full message content
     */
    details() {
        return getMessage(this.agent, this.id_);
    }
    /**
     * @esi_route ~get_characters_character_id_mail_mail_id
     *
     * @returns The summary header for the message
     */
    summary() {
        return this.details().then(msg => getSummaryFromMessage(this.id_, msg));
    }
    /**
     * @esi_route delete_characters_character_id_mail_mail_id
     *
     * @returns An empty promise that resolves after the message has been deleted
     */
    del() {
        return deleteMessage(this.agent, this.id_);
    }
    /**
     * @esi_route put_characters_character_id_mail_mail_id
     *
     * @param labels The label ids attached to the message
     * @param read Whether or not the message is marked as read, defaults to true
     * @return An empty promise that resolves after the message has been updated
     */
    update(labels, read = true) {
        return updateMessage(this.agent, this.id_, labels, read);
    }
}
exports.Message = Message;
/**
 * An api adapter for accessing various details of a set of messages,
 * specified by provided mail ids when the api is instantiated.
 */
class MappedMessages extends r.impl.SimpleMappedResource {
    constructor(agent, ids) {
        super(ids);
        this.agent = agent;
    }
    /**
     * @returns The full message content, mapped by id
     */
    details() {
        return this.getResource(id => getMessage(this.agent, id));
    }
    /**
     * @esi_route ~get_characters_character_id_mail_mail_id
     * @esi_route ~get_characters_character_id_mail
     *
     * @returns The summary header for the message, mapped by id
     */
    summary() {
        return this.arrayIDs().then(ids => {
            if (ids.length > 20) {
                // Instead of making 20+ detail requests, just filter through the
                // actual header responses
                if (this.headers_ === undefined) {
                    this.headers_ = getHeaders(this.agent, []);
                }
                return r.impl.filterIteratedToMap(this.headers_(), ids, e => e.mail_id || 0);
            }
            else {
                // Make individual details requests and rebuild
                return this.getResource(id => getMessage(this.agent, id)
                    .then(msg => getSummaryFromMessage(id, msg)));
            }
        });
    }
    /**
     * @esi_route delete_characters_character_id_mail_mail_id
     *
     * @returns An empty promise that resolves after messages have been deleted
     */
    del() {
        // Discard the map afterwards
        return this.getResource(id => deleteMessage(this.agent, id))
            .then(map => undefined);
    }
    /**
     * @esi_route put_characters_character_id_mail_mail_id
     *
     * @param labels The label ids attached to the messages
     * @param read Whether or not the messages are marked as read, defaults to
     *     true
     * @return An empty promise that resolves after the messages have been
     *     updated
     */
    update(labels, read = true) {
        // Discard the map afterwards
        return this.getResource(id => updateMessage(this.agent, id, labels, read))
            .then(map => undefined);
    }
}
exports.MappedMessages = MappedMessages;
/**
 * An api adapter for accessing various details about every mail in the
 * character's inbox, possibly constrained by a set of labels specified at
 * construction.
 */
class IteratedMessages extends r.impl.SimpleIteratedResource {
    constructor(agent, labels) {
        super(getHeaders(agent, labels), e => e.mail_id || 0);
        this.agent = agent;
    }
    /**
     * @returns The message details for every mail in the character's inbox,
     *    possibly constrained by a label set
     */
    details() {
        return this.getResource(id => getMessage(this.agent, id));
    }
    /**
     * @returns The message summaries for every mail in the character's inbox,
     *    possibly constrained by a label set
     */
    summary() {
        return this.getPaginatedResource();
    }
}
exports.IteratedMessages = IteratedMessages;
/**
 * An api adapter for accessing various details of a single mail label,
 * specified by a provided label id when the api is instantiated.
 */
class Label extends r.impl.SimpleResource {
    constructor(agent, id) {
        super(id);
        this.agent = agent;
    }
    /**
     * @returns An IteratedMessages API restricted to this specific label
     */
    get messages() {
        if (this.messages_ === undefined) {
            this.messages_ = new IteratedMessages(this.agent, [this.id_]);
        }
        return this.messages_;
    }
    /**
     * @esi_route ~get_characters_character_id_mail_labels
     *
     * @returns The full label details
     */
    details() {
        return getLabels(this.agent)
            .then(all => r.impl.filterArray(all.labels || [], this.id_, e => e.label_id || 0));
    }
    /**
     * @esi_route ~get_characters_character_id_mail_labels
     *
     * @returns The number of unread messages with this label
     */
    unreadCount() {
        return this.details().then(details => details.unread_count || 0);
    }
    /**
     * @esi_route delete_characters_character_id_mail_labels_label_id
     *
     * @returns An empty promise that resolves after the label has been deleted
     */
    del() {
        return deleteLabel(this.agent, this.id_);
    }
}
exports.Label = Label;
/**
 * An api adapter for accessing various details of a set of labels,
 * specified by provided label ids when the api is instantiated.
 */
class MappedLabels extends r.impl.SimpleMappedResource {
    constructor(agent, ids) {
        super(ids);
        this.agent = agent;
    }
    /**
     * @returns An IteratedMessages API restricted to the label set
     */
    get messages() {
        if (this.messages_ === undefined) {
            this.messages_ = new IteratedMessages(this.agent, () => this.arrayIDs());
        }
        return this.messages_;
    }
    /**
     * @esi_route ~get_characters_character_id_mail_labels
     *
     * @returns The full label details, mapped by label id
     */
    details() {
        return this.arrayIDs()
            .then(ids => getLabels(this.agent)
            .then(all => r.impl.filterArrayToMap(all.labels || [], ids, e => e.label_id || 0)));
    }
    /**
     * @esi_route ~get_characters_character_id_mail_labels
     *
     * @returns The number of unread messages for each label, mapped by id
     */
    unreadCount() {
        return this.details().then(map => {
            let remap = new Map();
            for (let [k, v] of map.entries()) {
                remap.set(k, v.unread_count || 0);
            }
            return remap;
        });
    }
    /**
     * @esi_route delete_characters_character_id_mail_labels_label_id
     *
     * @returns An empty promise that resolves after all specified labels have
     *     been deleted
     */
    del() {
        // Discard the map
        return this.getResource(id => deleteLabel(this.agent, id))
            .then(map => undefined);
    }
}
exports.MappedLabels = MappedLabels;
/**
 * An api adapter for accessing various details about every label in the
 * character's inbox.
 */
class IteratedLabels extends r.impl.SimpleIteratedResource {
    constructor(agent) {
        super(r.impl.makeArrayStreamer(() => getLabels(agent).then(all => all.labels || [])), e => e.label_id || 0);
        this.agent = agent;
    }
    /**
     * @returns The label details for every defined label defined by the character
     */
    details() {
        return this.getPaginatedResource();
    }
    /**
     * @returns The unread message count within each label
     */
    unreadCount() {
        return __asyncGenerator(this, arguments, function* unreadCount_1() {
            try {
                for (var _a = __asyncValues(this.details()), _b; _b = yield __await(_a.next()), !_b.done;) {
                    let [id, label] = yield __await(_b.value);
                    yield [id, label.unread_count];
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_b && !_b.done && (_c = _a.return)) yield __await(_c.call(_a));
                }
                finally { if (e_1) throw e_1.error; }
            }
            var e_1, _c;
        });
    }
}
exports.IteratedLabels = IteratedLabels;
/**
 * An api adapter over the end points handling the mail inbox for a character
 * via functions in the [mail](https://esi.tech.ccp.is/latest/#/Mail) ESI
 * endpoints.
 */
class Mail {
    constructor(agent) {
        this.agent = agent;
    }
    get labels() {
        if (this.labels_ === undefined) {
            this.labels_ = makeLabels(this.agent);
        }
        return this.labels_;
    }
    messages(ids) {
        if (ids === undefined) {
            return new IteratedMessages(this.agent, []);
        }
        else if (typeof ids === 'number') {
            return new Message(this.agent, ids);
        }
        else {
            return new MappedMessages(this.agent, ids);
        }
    }
    /**
     * @esi_route ~get_characters_character_id_mail_labels
     *
     * @returns The total number of unread messages in a character's inbox
     */
    unreadCount() {
        return this.agent.agent.request('get_characters_character_id_mail_labels', { path: { character_id: this.agent.id } }, this.agent.ssoToken)
            .then(result => result.total_unread_count || 0);
    }
    /**
     * @esi_route post_characters_character_id_cspa
     *
     * @param toIds Array of entities to potentially send a mail to
     * @returns The cspa cost for sending a message to the given entities
     */
    cspaCost(toIds) {
        return this.agent.agent.request('post_characters_character_id_cspa', { path: { character_id: this.agent.id }, body: { characters: toIds } }, this.agent.ssoToken).then(result => result.cost || 0);
    }
    /**
     * @esi_route post_characters_character_id_mail
     *
     * @param mail The mail specification
     * @return The sent mail's id
     */
    send(mail) {
        return this.agent.agent.request('post_characters_character_id_mail', { path: { character_id: this.agent.id }, body: mail }, this.agent.ssoToken);
    }
    /**
     * @returns List of details for a character's mailing list memberships
     */
    lists() {
        return this.agent.agent.request('get_characters_character_id_mail_lists', { path: { character_id: this.agent.id } }, this.agent.ssoToken);
    }
}
exports.Mail = Mail;
function makeLabels(agent) {
    let labels = function (ids) {
        if (ids === undefined) {
            // All labels
            return new IteratedLabels(agent);
        }
        else if (typeof ids === 'number') {
            // Single label
            return new Label(agent, ids);
        }
        else {
            // Multiple labels
            return new MappedLabels(agent, ids);
        }
    };
    labels.add = function (settings) {
        return agent.agent.request('post_characters_character_id_mail_labels', { path: { character_id: agent.id }, body: settings }, agent.ssoToken);
    };
    return labels;
}
function getLabels(agent) {
    return agent.agent.request('get_characters_character_id_mail_labels', { path: { character_id: agent.id } }, agent.ssoToken);
}
function deleteLabel(agent, id) {
    return agent.agent.request('delete_characters_character_id_mail_labels_label_id', { path: { character_id: agent.id, label_id: id } }, agent.ssoToken);
}
function getSummaryFromMessage(id, message) {
    return {
        from: message.from,
        is_read: message.read,
        labels: message.labels,
        mail_id: id,
        recipients: message.recipients,
        subject: message.subject,
        timestamp: message.timestamp
    };
}
function getHeaders(agent, labels) {
    return r.impl.makeMaxIDStreamer(fromID => getHeaderPage(agent, labels, fromID), e => e.mail_id || 0, 50);
}
function getHeaderPage(agent, labels, fromID) {
    return __awaiter(this, void 0, void 0, function* () {
        let labelIDS;
        if (Array.isArray(labels)) {
            labelIDS = labels;
        }
        else if (labels instanceof Set) {
            labelIDS = Array.from(labels);
        }
        else {
            labelIDS = yield labels();
        }
        return agent.agent.request('get_characters_character_id_mail', {
            path: { character_id: agent.id },
            query: { labels: labelIDS, last_mail_id: fromID }
        }, agent.ssoToken);
    });
}
function getMessage(agent, id) {
    return agent.agent.request('get_characters_character_id_mail_mail_id', { path: { character_id: agent.id, mail_id: id } }, agent.ssoToken);
}
function deleteMessage(agent, id) {
    return agent.agent.request('delete_characters_character_id_mail_mail_id', { path: { character_id: agent.id, mail_id: id } }, agent.ssoToken);
}
function updateMessage(agent, id, labels, read) {
    return agent.agent.request('put_characters_character_id_mail_mail_id', { path: { character_id: agent.id, mail_id: id }, body: { labels, read } }, agent.ssoToken);
}
//# sourceMappingURL=mail.js.map