/**
 * A container for the [calendar](https://esi.tech.ccp.is/latest/#/Calendar)
 * ESI endpoints. You should not require this module directly, as it technically
 * returns a factory function that requires an internal API. Instead an instance
 * is automatically exposed when the 
 * {@link module:character} is loaded and configured.
 *
 * @see https://esi.tech.ccp.is/latest/#/Calendar
 * @param api The internal API instance configured by the root module
 * @module character/calendar
 */
 module.exports = function(api) {
    var newRequest = api.newRequest;
    var newRequestOpt = api.newRequestOpt;
    var ESI = api.esi;

    var exports = {};

    /**
     * Get up to 50 future calendar event summaries for the given character via 
     * the ESI end point. If `fromEventId` is provided, the returned events will
     * be the next 50 events chronologically beyond the event.
     *
     * This makes an HTTP GET request to [`/characters/{characterId}/calendar`](https://esi.tech.ccp.is/latest/#!/Calendar/get_characters_character_id_calendar).
     * The request is returned as an asynchronous Promise that resolves to 
     * an array parsed from the response JSON model. An example value looks 
     * like:
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
     * @param {Integer} characterId The character id
     * @param {String} accessToken Optional; the access token to authenticate
     *   contact access of the sending character. If not provided, the default
     *   access token is used. This will fail if neither is available.
     * @param {Integer} fromEventId Optional; the event id that returned events
     *   will be chronologically later than.
     * @return {external:Promise} A Promise that resolves to the response of
     *   the request
     * @see https://esi.tech.ccp.is/latest/#!/Calendar/get_characters_character_id_calendar
     * @esi_link CalendarApi.getCharactersCharacterIdCalendar
     */
    exports.get = function(characterId, accessToken, fromEventId) {
        var opts = {};
        if (fromEventId) {
            opts.fromEvent = fromEventId;
        }
        return newRequestOpt(ESI.CalendarApi, 
                             'getCharactersCharacterIdCalendar',
                             [characterId], opts, accessToken);
    };

    /**
     * Get all information for a specific event via the ESI end point.
     * This makes an HTTP GET request to [`/characters/{characterId}/calendar/{eventId}`](https://esi.tech.ccp.is/latest/#!/Calendar/get_characters_character_id_calendar_event_id).
     * The request is returned as an asynchronous Promise that resolves to 
     * an object parsed from the response JSON model. An example value looks 
     * like:
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
     *   "text": "o7: The EVE Online Show features latest developer news, fast paced action, community overviews and a lot more with CCP Guard and CCP Mimic. Join the thrilling o7 live broadcast at 20:00 EVE time (=UTC) on <a href=\"http://www.twitch.tv/ccp\">EVE TV</a>. Don't miss it!",
     *   "title": "o7 The EVE Online Show"
     * }
     * ```
     * 
     * @param {Integer} characterId The character id
     * @param {Integer} eventId The event id
     * @param {String} accessToken Optional; the access token to authenticate
     *   contact access of the sending character. If not provided, the default
     *   access token is used. This will fail if neither is available.
     * @return {external:Promise} A Promise that resolves to the response of
     *   the request
     * @see https://esi.tech.ccp.is/latest/#!/Calendar/get_characters_character_id_calendar_event_id
     * @esi_link CalendarApi.getCharactersCharacterIdCalendarEventId
     */
    exports.getEvent = function(characterId, eventId, accessToken) {
        return newRequest(ESI.CalendarApi, 
                          'getCharactersCharacterIdCalendarEventId',
                          [characterId, eventId], accessToken);
    };

    /**
     * Update response for a specific event via the ESI end point.
     * This makes an HTTP PUT request to [`/characters/{characterId}/calendar/{eventId}`](https://esi.tech.ccp.is/latest/#!/Calendar/put_characters_character_id_calendar_event_id).
     * The request is returned as an asynchronous Promise that resolves to 
     * an empty object on success. Allowed response values can be
     *
     * 1. `'rejected'`
     * 2. `'accepted'`
     * 3. `'undecided'`
     * 
     * @param {Integer} characterId The character id
     * @param {Integer} eventId The event id
     * @param {String} response The response to the event invitation
     * @param {String} accessToken Optional; the access token to authenticate
     *   contact access of the sending character. If not provided, the default
     *   access token is used. This will fail if neither is available.
     * @return {external:Promise} A Promise that resolves to the response of
     *   the request
     * @see https://esi.tech.ccp.is/latest/#!/Calendar/put_characters_character_id_calendar_event_id
     * @esi_link CalendarApi.putCharactersCharacterIdCalendarEventId
     */
    exports.updateResponse = function(characterId, eventId, response, 
                                      accessToken) {
        return newRequest(ESI.CalendarApi, 
                          'putCharactersCharacterIdCalendarEventId',
                          [characterId, eventId, {response: response}], 
                          accessToken);
    };

    return exports;
};
