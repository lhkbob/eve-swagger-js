"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * An api adapter that provides functions for accessing an authenticated
 * character's notifications via the
 * [character](https://esi.tech.ccp.is/latest/#/Character) ESI end points.
 */
class Notifications {
    constructor(agent) {
        this.agent = agent;
    }
    /**
     * @returns The recent general-purpose notifications sent to the character
     */
    recent() {
        return this.agent.agent.request('get_characters_character_id_notifications', { path: { character_id: this.agent.id } }, this.agent.ssoToken);
    }
    /**
     * @returns Recent contact notifications sent to the character, issued when
     *     another character adds them as a contact
     */
    contacts() {
        return this.agent.agent.request('get_characters_character_id_notifications_contacts', { path: { character_id: this.agent.id } }, this.agent.ssoToken);
    }
}
exports.Notifications = Notifications;
//# sourceMappingURL=notifications.js.map