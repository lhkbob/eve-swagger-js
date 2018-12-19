import { SSOAgent } from '../../internal/esi-agent';
import { Responses } from '../../../gen/esi';
/**
 * An api adapter that provides functions for accessing various details for a
 * specific event specified by id via functions in the
 * [calendar](https://esi.evetech.net/latest/#/Calendar) ESI endpoints.
 */
export interface Event {
    /**
     * @esi_example esi.characters(1, 'token').calendar.event(2).info()
     *
     * @returns Details about the specific event
     */
    info(): Promise<Responses['get_characters_character_id_calendar_event_id']>;
    /**
     * Respond to the event for this character, with the specific status.
     *
     * @esi_example esi.characters(1,
     *     'token').calendar.event(2).respond('accepted')
     *
     * @param status Accept, decline or mark the event as tentative
     * @returns An empty promise resolving when the request completes
     */
    respond(status: 'accepted' | 'declined' | 'tentative'): Promise<Responses['put_characters_character_id_calendar_event_id']>;
    /**
     * @returns The event id in the character's calendar
     */
    id(): Promise<number>;
}
/**
 * An api adapter over the end points handling a character's calendar via
 * functions in the [calendar](https://esi.evetech.net/latest/#/Calendar)
 * ESI endpoints.
 */
export interface Calendar {
    /**
     * Get the most recent event ids.
     *
     * @esi_example esi.characters(1, 'token').calendar()
     *
     * @returns List of latest event ids in chronological order
     */
    (): Promise<Responses['get_characters_character_id_calendar']>;
    /**
     * Create a new Event end point targeting the particular event by `id`.
     *
     * @param id The event id
     * @returns An Event APi wrapper for the id
     */
    (id: number): Event;
    /**
     * Due to the unbounded nature of time, no utility is provided to paginate
     * all calendar events into a single list.
     *
     * @esi_example esi.characters(1, 'token').calendar.history(from)
     *
     * @param fromEventId If not provided, the latest events are returned.
     *     Otherwise events older than the given id are returned
     * @returns List of event ids in chronological order
     */
    history(fromEventId?: number): Promise<Responses['get_characters_character_id_calendar']>;
}
/**
 * Create a new {@link Calendar} instance that uses the given character agent to
 * make its HTTP requests to the ESI interface.
 *
 * @param char The character access information
 * @returns An Calendar API instance
 */
export declare function makeCalendar(char: SSOAgent): Calendar;
