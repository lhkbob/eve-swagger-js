import { SSOAgent } from '../../internal/esi-agent';
import { esi, Responses } from '../../esi';
import * as r from '../../internal/resource-api';
/**
 * The API specification for all variants that access information about a
 * character's calendar event or events. This interface will
 * not
 * be used directly, but will be filtered through some mapper, such as {@link
    * Async} or {@link Mapped} depending on what types of ids are being
 * accessed. However, this allows for a concise and consistent specification
 * for all variants: single, multiple, and all events.
 *
 * When mapped, each key defined in this interface becomes a function that
 * returns a Promise resolving to the key's member, or a collection related
 * to the key's member if multiple events are being accessed at once.
 *
 * An api adapter over the end points handling a specific event via functions
 * in the [calendar](https://esi.tech.ccp.is/latest/#Calendar) ESI
 * endpoints.
 */
export interface EventAPI {
    details: Responses['get_characters_character_id_calendar_event_id'];
    summary: esi.character.calendar.Calendar;
    attendees: Responses['get_characters_character_id_calendar_event_id_attendees'];
}
/**
 * An api adapter for accessing various details of a single event,
 * specified by a provided event id when the api is instantiated.
 */
export declare class Event extends r.impl.SimpleResource implements r.Async<EventAPI> {
    private agent;
    constructor(agent: SSOAgent<number>, id: number);
    /**
     * @returns Details about the specific event
     */
    details(): Promise<esi.character.calendar.Event>;
    /**
     * @esi_route ~get_characters_character_id_calendar_event_id
     *
     * @returns A summary of the specific event
     */
    summary(): Promise<esi.character.calendar.Calendar>;
    /**
     * @returns The attendees and their responses for the event
     */
    attendees(): Promise<esi.character.calendar.Attendee[]>;
    /**
     * Respond to the event for this character, with the specific status.
     *
     * @esi_route put_characters_character_id_calendar_event_id
     *
     * @param status Accept, decline or mark the event as tentative
     * @returns An empty promise resolving when the request completes
     */
    respond(status: 'accepted' | 'declined' | 'tentative'): Promise<undefined>;
}
/**
 * An api adapter for accessing various details of multiple event ids,
 * specified by a provided an array or set of ids when the api is instantiated.
 */
export declare class MappedEvents extends r.impl.SimpleMappedResource implements r.Mapped<EventAPI> {
    private agent;
    constructor(agent: SSOAgent<number>, ids: number[] | Set<number>);
    /**
     * @esi_route ~get_characters_character_id_calendar_event_id
     *
     * @returns The event summaries for the specified events, mapped by id
     */
    summary(): Promise<Map<number, esi.character.calendar.Calendar>>;
    /**
     * @returns The event details, mapped by id
     */
    details(): Promise<Map<number, esi.character.calendar.Event>>;
    /**
     * @returns The event attendees, mapped by id
     */
    attendees(): Promise<Map<number, esi.character.calendar.Attendee[]>>;
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
    respond(status: 'accepted' | 'declined' | 'tentative'): Promise<undefined>;
}
/**
 * An api adapter for accessing various details about every event on the
 * character's calendar.
 */
export declare class IteratedEvents extends r.impl.SimpleIteratedResource<esi.character.calendar.Calendar> implements r.Iterated<EventAPI> {
    private agent;
    constructor(agent: SSOAgent<number>);
    /**
     * @esi_route get_characters_character_id_calendar_event_id
     *
     * @returns The event summaries for every event in the character's calendar,
     *     ordered by most recent first
     */
    summary(): AsyncIterableIterator<[number, esi.character.calendar.Calendar]>;
    /**
     * @returns The event details for every event on the character's calendar,
     *     ordered most recent first
     */
    details(): AsyncIterableIterator<[number, esi.character.calendar.Event]>;
    /**
     * @returns Every event's attendees
     */
    attendees(): AsyncIterableIterator<[number, esi.character.calendar.Attendee[]]>;
}
/**
 * A functional interface for getting an event, a specific set of events, or
 * all events in a character's calendar.
 */
export interface Calendar {
    /**
     * Create a new events api targeting every event on the character's calendar.
     *
     * @returns An IteratedEvents API wrapper
     */
    (): IteratedEvents;
    /**
     * Create a new Event end point targeting the particular event by `id`.
     *
     * @param id The event id
     * @returns An Event API wrapper for the id
     */
    (id: number): Event;
    /**
     * Create a new events api targeting the multiple event ids. If an array is
     * provided, duplicates are removed (although the input array is not
     * modified).
     *
     * @param ids The event ids
     * @returns A MappedEvents API wrapper
     */
    (ids: number[] | Set<number>): MappedEvents;
}
/**
 * Create a new {@link Calendar} instance that uses the given character agent to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The character access information
 * @returns An Calendar API instance
 */
export declare function makeCalendar(agent: SSOAgent<number>): Calendar;
