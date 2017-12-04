"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const r = require("../../internal/resource-api");
/**
 * An api adapter for accessing various details of a single event,
 * specified by a provided event id when the api is instantiated.
 */
class Event extends r.impl.SimpleResource {
    constructor(agent, id) {
        super(id);
        this.agent = agent;
    }
    /**
     * @returns Details about the specific event
     */
    details() {
        return getDetails(this.agent, this.id_);
    }
    /**
     * @esi_route ~get_characters_character_id_calendar_event_id
     *
     * @returns A summary of the specific event
     */
    summary() {
        return this.details()
            .then(getSummaryFromDetails);
    }
    /**
     * @returns The attendees and their responses for the event
     */
    attendees() {
        return getAttendees(this.agent, this.id_);
    }
    /**
     * Respond to the event for this character, with the specific status.
     *
     * @esi_route put_characters_character_id_calendar_event_id
     *
     * @param status Accept, decline or mark the event as tentative
     * @returns An empty promise resolving when the request completes
     */
    respond(status) {
        return sendResponse(this.agent, this.id_, status);
    }
}
exports.Event = Event;
/**
 * An api adapter for accessing various details of multiple event ids,
 * specified by a provided an array or set of ids when the api is instantiated.
 */
class MappedEvents extends r.impl.SimpleMappedResource {
    constructor(agent, ids) {
        super(ids);
        this.agent = agent;
    }
    /**
     * @esi_route ~get_characters_character_id_calendar_event_id
     *
     * @returns The event summaries for the specified events, mapped by id
     */
    summary() {
        return this.getResource(id => getDetails(this.agent, id).then(getSummaryFromDetails));
    }
    /**
     * @returns The event details, mapped by id
     */
    details() {
        return this.getResource(id => getDetails(this.agent, id));
    }
    /**
     * @returns The event attendees, mapped by id
     */
    attendees() {
        return this.getResource(id => getAttendees(this.agent, id));
    }
    /**
     * Sends the same response to the specified set of events. The promise will
     * fail if any of the individual event responses fails, although some may
     * have
     * been successfully sent.
     *
     * @param status The status to send for the event set
     * @returns An empty promise that resolves when all responses in the set have
     *     been sent
     */
    respond(status) {
        // Discard the map
        return this.getResource(id => sendResponse(this.agent, id, status))
            .then(map => undefined);
    }
}
exports.MappedEvents = MappedEvents;
/**
 * An api adapter for accessing various details about every event on the
 * character's calendar.
 */
class IteratedEvents extends r.impl.SimpleIteratedResource {
    constructor(agent) {
        super(r.impl.makeMaxIDStreamer(eventID => getCalendarPage(agent, eventID), e => e.event_id || 0, 50), e => e.event_id || 0);
        this.agent = agent;
    }
    /**
     * @esi_route get_characters_character_id_calendar_event_id
     *
     * @returns The event summaries for every event in the character's calendar,
     *     ordered by most recent first
     */
    summary() {
        return this.getPaginatedResource();
    }
    /**
     * @returns The event details for every event on the character's calendar,
     *     ordered most recent first
     */
    details() {
        return this.getResource(id => getDetails(this.agent, id));
    }
    /**
     * @returns Every event's attendees
     */
    attendees() {
        return this.getResource(id => getAttendees(this.agent, id));
    }
}
exports.IteratedEvents = IteratedEvents;
/**
 * Create a new {@link Calendar} instance that uses the given character agent to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The character access information
 * @returns An Calendar API instance
 */
function makeCalendar(agent) {
    return function (ids) {
        if (ids === undefined) {
            // Access all events
            return new IteratedEvents(agent);
        }
        else if (typeof ids === 'number') {
            // Single event
            return new Event(agent, ids);
        }
        else {
            // Multiple events
            return new MappedEvents(agent, ids);
        }
    };
}
exports.makeCalendar = makeCalendar;
function getSummaryFromDetails(details) {
    return {
        event_id: details.event_id,
        event_date: details.date,
        title: details.title,
        event_response: details.response,
        importance: details.importance
    };
}
function getCalendarPage(agent, eventID) {
    return agent.agent.request('get_characters_character_id_calendar', { path: { character_id: agent.id }, query: { from_event: eventID } }, agent.ssoToken);
}
function getAttendees(agent, id) {
    return agent.agent.request('get_characters_character_id_calendar_event_id_attendees', { path: { character_id: agent.id, event_id: id } }, agent.ssoToken);
}
function getDetails(agent, id) {
    return agent.agent.request('get_characters_character_id_calendar_event_id', { path: { character_id: agent.id, event_id: id } }, agent.ssoToken);
}
function sendResponse(agent, id, state) {
    return agent.agent.request('put_characters_character_id_calendar_event_id', {
        path: { character_id: agent.id, event_id: id }, body: { response: state }
    }, agent.ssoToken);
}
//# sourceMappingURL=calendar.js.map