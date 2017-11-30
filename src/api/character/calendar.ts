import { SSOAgent } from '../../internal/esi-agent';
import { esi, Responses } from '../../esi';
import * as r from '../../internal/resource-api';
import { Mapped } from '../../internal/resource-api';

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
export class Event extends r.impl.SimpleResource implements r.Async<EventAPI> {
  constructor(private agent: SSOAgent<number>, id: number) {
    super(id);
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
  respond(status: 'accepted' | 'declined' | 'tentative'): Promise<undefined> {
    return sendResponse(this.agent, this.id_, status);
  }
}

/**
 * An api adapter for accessing various details of multiple event ids,
 * specified by a provided an array or set of ids when the api is instantiated.
 */
export class MappedEvents extends r.impl.SimpleMappedResource implements r.Mapped<EventAPI> {
  constructor(private agent: SSOAgent<number>, ids: number[] | Set<number>) {
    super(ids);
  }

  /**
   * @esi_route ~get_characters_character_id_calendar_event_id
   *
   * @returns The event summaries for the specified events, mapped by id
   */
  summary() {
    return this.getResource(
        id => getDetails(this.agent, id).then(getSummaryFromDetails));
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
  respond(status: 'accepted' | 'declined' | 'tentative'): Promise<undefined> {
    // Discard the map
    return this.getResource(id => sendResponse(this.agent, id, status))
    .then(map => undefined);
  }
}

/**
 * An api adapter for accessing various details about every event on the
 * character's calendar.
 */
export class IteratedEvents extends r.impl.SimpleIteratedResource<esi.character.calendar.Calendar> implements r.Iterated<EventAPI> {
  constructor(private agent: SSOAgent<number>) {
    super(r.impl.makeMaxIDStreamer(eventID => getCalendarPage(agent, eventID),
        e => e.event_id || 0, 50), e => e.event_id || 0);
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
export function makeCalendar(agent: SSOAgent<number>): Calendar {
  return <Calendar> function (ids: number | number[] | Set<number> | undefined) {
    if (ids === undefined) {
      // Access all events
      return new IteratedEvents(agent);
    } else if (typeof ids === 'number') {
      // Single event
      return new Event(agent, ids);
    } else {
      // Multiple events
      return new MappedEvents(agent, ids);
    }
  };
}

function getSummaryFromDetails(details: esi.character.calendar.Event): esi.character.calendar.Calendar {
  return {
    event_id: details.event_id,
    event_date: details.date,
    title: details.title,
    event_response: <esi.character.calendar.ResponseState> details.response,
    importance: details.importance
  };
}

function getCalendarPage(agent: SSOAgent<number>, eventID?: number) {
  return agent.agent.request('get_characters_character_id_calendar',
      { path: { character_id: agent.id }, query: { from_event: eventID } },
      agent.ssoToken);
}

function getAttendees(agent: SSOAgent<number>, id: number) {
  return agent.agent.request(
      'get_characters_character_id_calendar_event_id_attendees',
      { path: { character_id: agent.id, event_id: id } }, agent.ssoToken);
}

function getDetails(agent: SSOAgent<number>, id: number) {
  return agent.agent.request('get_characters_character_id_calendar_event_id',
      { path: { character_id: agent.id, event_id: id } }, agent.ssoToken);
}

function sendResponse(agent: SSOAgent<number>, id: number,
    state: 'accepted' | 'declined' | 'tentative') {
  return agent.agent.request('put_characters_character_id_calendar_event_id', {
    path: { character_id: agent.id, event_id: id }, body: { response: state }
  }, agent.ssoToken);
}
