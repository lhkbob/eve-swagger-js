const CallableInstance = require('../../internal/callable-instance');

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
   * @esi_example esi.characters(1, 'token').calendar(2).info()
   *
   * @returns {Promise.<Object>}
   */
  info() {
    return this._cal._agent.auth(this._cal._token)
    .get('/v3/characters/{character_id}/calendar/{event_id}/', {
      path: {
        'character_id': this._cal._id,
        'event_id': this._id
      }
    });
  }

  _respond(state) {
    return this._cal._agent.auth(this._cal._token)
    .put('/v3/characters/{character_id}/calendar/{event_id}/', {
      path: {
        'character_id': this._cal._id,
        'event_id': this._id
      },
      body: { 'response': state }
    });
  }

  /**
   * @esi_route put_characters_character_id_calendar_event_id
   * @esi_param response - {"response": "declined"}
   * @esi_example esi.characters(1, 'token').calendar(2).decline()
   *
   * @returns {Promise.<Object>}
   */
  decline() {
    return this._respond('declined');
  }

  /**
   * @esi_route put_characters_character_id_calendar_event_id
   * @esi_param response - {"response": "accepted"}
   * @esi_example esi.characters(1, 'token').calendar(2).accept()
   *
   * @returns {Promise.<Object>}
   */
  accept() {
    return this._respond('accepted');
  }

  /**
   * @esi_route put_characters_character_id_calendar_event_id
   * @esi_param response - {"response": "tentative"}
   * @esi_example esi.characters(1, 'token').calendar(2).tentative()
   *
   * @returns {Promise.<Object>}
   */
  tentative() {
    return this._respond('tentative');
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
class Calendar extends CallableInstance {
  /**
   * Create a new Calendar function using the given `agent`, for the
   * character described by `characterId` with SSO access from `token`.
   *
   * @param agent {ESIAgent} The ESI agent
   * @param characterId {Number} The character id whose calendar is accessed
   * @param token {String} The SSO access token for the character
   * @constructor
   */
  constructor(agent, characterId, token) {
    super(id => (id ? this.event(id) : this.recent()));
    this._agent = agent;
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
   * @esi_example esi.characters(1, 'token').calendar()
   *
   * @param fromEventId {Number} If `0`, the most recent events are returned.
   * @returns {Promise.<Array.<Object>>}
   */
  recent(fromEventId = 0) {
    return this._agent.auth(this._token)
    .get('/v1/characters/{character_id}/calendar/', {
      path: { 'character_id': this._id },
      query: { 'from_event': fromEventId == 0 ? null : fromEventId }
    });
  }
}

module.exports = Calendar;
