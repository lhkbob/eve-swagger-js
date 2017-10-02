"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Create a new {@link Calendar} instance that uses the given character agent to
 * make its HTTP requests to the ESI interface.
 *
 * @param char The character access information
 * @returns An Calendar API instance
 */
function makeCalendar(char) {
    let calendar = function (id) {
        if (id === undefined) {
            return calendar.history();
        }
        else {
            return new EventImpl(char, id);
        }
    };
    calendar.history = function (fromId) {
        return char.agent.request('get_characters_character_id_calendar', {
            path: { character_id: char.id }, query: { from_event: fromId }
        }, char.ssoToken);
    };
    return calendar;
}
exports.makeCalendar = makeCalendar;
class EventImpl {
    constructor(char, id_) {
        this.char = char;
        this.id_ = id_;
    }
    info() {
        return this.char.agent.request('get_characters_character_id_calendar_event_id', { path: { character_id: this.char.id, event_id: this.id_ } }, this.char.ssoToken);
    }
    respond(state) {
        return this.char.agent.request('put_characters_character_id_calendar_event_id', {
            path: { character_id: this.char.id, event_id: this.id_ },
            body: { response: state }
        }, this.char.ssoToken);
    }
    id() {
        return Promise.resolve(this.id_);
    }
}
//# sourceMappingURL=calendar.js.map