const ExtendableFunction = require('../../internal/ExtendableFunction');

function respondToEvent(calendar, eventId, response) {
  return calendar._api.calendar(calendar._token)
  .newRequest('putCharactersCharacterIdCalendarEventId',
      [calendar._id, eventId], { response: response });
}

/**
 * An api adapter that provides functions for accessing various details for a
 * specific event specified by id via functions in the
 * [calendar](https://esi.tech.ccp.is/latest/#/Calendar) ESI endpoints.
 *
 * You should not usually instantiate this directly as its constructor requires
 * an internal api instance.
 */
class Event {
  /**
   * Create a new Event represented as `eventId` from the given `calendar`.
   *
   * @param calendar {Calendar} The calendar owning the event
   * @param eventId {Number} The event id that is used for all requests
   * @constructor
   */
  constructor(calendar, eventId) {
    this._cal = calendar;
    this._id = eventId;
  }

  /**
   * Get all information for a specific event via the ESI end point. This makes
   * an HTTP GET request to
   * [`/characters/{characterId}/calendar/{eventId}`](https://esi.tech.ccp.is/latest/#!/Calendar/get_characters_character_id_calendar_event_id).
   * The request is returned as an asynchronous Promise that resolves to an
   * object parsed from the response JSON model. An example value looks like:
   *
   * ```
   * {
   *   "date": "2016-06-26T21:00:00Z",
   *   "duration": 60,
   *   "event_id": 1386435,
   *   "importance": 1,
   *   "owner_id": 1,
   *   "owner_name": "EVE System",
   *   "owner_type": "eve_server",
   *   "response": "Undecided",
   *   "text": "o7: The EVE Online Show features latest developer news, fast
   * paced action, community overviews and a lot more with CCP Guard and CCP
   * Mimic. Join the thrilling o7 live broadcast at 20:00 EVE time (=UTC) on
   * <a href=\"http://www.twitch.tv/ccp\">EVE TV</a>. Don't miss it!",
   *   "title": "o7 The EVE Online Show"
   * }
   * ```
   *
   * @return {Promise} A Promise that resolves to the response of the request
   * @esi_link CalendarApi.getCharactersCharacterIdCalendarEventId
   */
  info() {
    return this._cal._api.calendar(this._cal._token)
    .newRequest('getCharactersCharacterIdCalendarEventId',
        [this._cal._id, this._id]);
  }

  /**
   * Update response for the event to be `'rejected'`, via the ESI end point.
   * This makes an HTTP PUT request to
   * [`/characters/{characterId}/calendar/{eventId}`](https://esi.tech.ccp.is/latest/#!/Calendar/put_characters_character_id_calendar_event_id).
   * The request is returned as an asynchronous Promise that resolves to an
   * empty object on success.
   *
   * @return {Promise} A Promise that resolves to the response of the request
   * @esi_link CalendarApi.putCharactersCharacterIdCalendarEventId
   */
  reject() {
    return respondToEvent(this._cal, this._id, 'rejected');
  }

  /**
   * Update response for the event to be `'accepted'`, via the ESI end point.
   * This makes an HTTP PUT request to
   * [`/characters/{characterId}/calendar/{eventId}`](https://esi.tech.ccp.is/latest/#!/Calendar/put_characters_character_id_calendar_event_id).
   * The request is returned as an asynchronous Promise that resolves to an
   * empty object on success.
   *
   * @return {Promise} A Promise that resolves to the response of the request
   * @esi_link CalendarApi.putCharactersCharacterIdCalendarEventId
   */
  accept() {
    return respondToEvent(this._cal, this._id, 'accepted');
  }

  /**
   * Update response for the event to be `'undecided'`, via the ESI end point.
   * This makes an HTTP PUT request to
   * [`/characters/{characterId}/calendar/{eventId}`](https://esi.tech.ccp.is/latest/#!/Calendar/put_characters_character_id_calendar_event_id).
   * The request is returned as an asynchronous Promise that resolves to an
   * empty object on success.
   *
   * @return {Promise} A Promise that resolves to the response of the request
   * @esi_link CalendarApi.putCharactersCharacterIdCalendarEventId
   */
  undecided() {
    return respondToEvent(this._cal, this._id, 'undecided');
  }
}

/**
 * An api adapter over the end points handling a character's calendar via
 * functions in the [calendar](https://esi.tech.ccp.is/latest/#/Calendar)
 * ESI endpoints. You should not usually instantiate this directly as its
 * constructor requires an internal api instance.
 *
 * This is a function class so instances of `Calendar` are functions and can be
 * invoked directly, besides accessing its members. Its default function action
 * is equivalent to {@link Calendar#event event} or {@link Calendar#recent
 * recent} if no id is provided.
 */
class Calendar extends ExtendableFunction {
  /**
   * Create a new Calendar function using the given `api`, for the
   * character described by `characterId` with SSO access from `token`.
   *
   * @param api {ApiProvider} The api provider
   * @param characterId {Number} The character id whose calendar is accessed
   * @param token {String} The SSO access token for the character
   * @constructor
   */
  constructor(api, characterId, token) {
    super(id => (id ? this.event(id) : this.recent()));
    this._api = api;
    this._id = characterId;
    this._token = token;
  }

  /**
   * Create a new Event end point targeting the particular event by
   * `id`.
   *
   * @param id {Number} The event id
   * @returns {Event}
   */
  event(id) {
    return new Event(this, id);
  }

  /**
   * Get up to 50 future calendar event summaries for the character via
   * the ESI end point. If `fromEventId` is provided, the returned events will
   * be the next 50 events chronologically beyond the event.
   *
   * This makes an HTTP GET request to
   * [`/characters/{characterId}/calendar`](https://esi.tech.ccp.is/latest/#!/Calendar/get_characters_character_id_calendar).
   * The request is returned as an asynchronous Promise that resolves to an
   * array parsed from the response JSON model. An example value looks like:
   *
   * ```
   * [
   *   {
   *     "event_date": "2016-06-26T20:00:00Z",
   *     "event_id": 1386435,
   *     "event_response": "accepted",
   *     "importance": 0,
   *     "title": "o7 The EVE Online Show"
   *   }
   * ]
   * ```
   *
   * @param {Number} fromEventId Optional; the event id that returned events
   *   will be chronologically later than.
   * @return {Promise} A Promise that resolves to the response of the request
   * @esi_link CalendarApi.getCharactersCharacterIdCalendar
   */
  recent(fromEventId = 0) {
    let opts = {};
    if (fromEventId) {
      opts.fromEvent = fromEventId;
    }
    return this._api.calendar(this._token)
    .newRequest('getCharactersCharacterIdCalendar', [this._id], opts);
  }
}

module.exports = Calendar;
