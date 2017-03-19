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
   * @esi_route get_characters_character_id_calendar_event_id
   * @returns {Promise.<Object>}
   */
  info() {
    return this._cal._api.calendar(this._cal._token)
    .newRequest('getCharactersCharacterIdCalendarEventId',
        [this._cal._id, this._id]);
  }

  /**
   * @esi_route put_characters_character_id_calendar_event_id
   * @esi_param response - {"response": "rejected"}
   *
   * @returns {Promise.<Object>}
   */
  reject() {
    return respondToEvent(this._cal, this._id, 'rejected');
  }

  /**
   * @esi_route put_characters_character_id_calendar_event_id
   * @esi_param response - {"response": "accepted"}
   *
   * @returns {Promise.<Object>}
   */
  accept() {
    return respondToEvent(this._cal, this._id, 'accepted');
  }

  /**
   * @esi_route put_characters_character_id_calendar_event_id
   * @esi_param response - {"response": "tentative"}
   *
   * @returns {Promise.<Object>}
   */
  undecided() {
    return respondToEvent(this._cal, this._id, 'tentative');
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
   * @esi_route get_characters_character_id_calendar
   * @esi_param from_event - fromEventId
   *
   * @param fromEventId {Number} If `0`, the most recent events are returned.
   * @returns {Promise.<Array.<Object>>}
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
