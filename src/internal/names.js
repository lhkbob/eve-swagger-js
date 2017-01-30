/**
 * Internal utility function to query names of a given set of `ids`. Although
 * the ESI end point allows returning mixed types, this returns names
 * corresponding to only a single type specified by `category`. This makes an
 * HTTP POST request to
 * [`/universe/names/`](https://esi.tech.ccp.is/latest/#!/Universe/post_universe_names).
 *
 * The request is returned as an asynchronous Promise that resolves to an object
 * parsed from the response JSON model. An example value looks like:
 *
 * ```
 * [
 *   {
 *     "id": 95465499,
 *     "name": "CCP Bartender"
 *   },
 *   {
 *     "id": 30000142,
 *     "name": "Jita"
 *   }
 * ]
 * ```
 *
 * `category` must be one of:
 *
 * # `'character'`
 * # `'corporation'`
 * # `'alliance'`
 * # `'station'`
 * # `'solar_system'`
 * # `'constellation'`
 * # `'region'`
 * # `'type'`
 *
 * @param api {ApiProvider} Internal api
 * @param category {String} Category to filter names to
 * @param ids {Array.<Number>} Ids to look up
 * @returns {Promise}
 * @private
 */
module.exports = function(api, category, ids) {
  return api.universe()
  .newRequest('postUniverseNames', [{ ids: ids }])
  .then(result => {
    // Filter by category and remove the category field
    return result.filter(r => r.category == category).map(r => {
      return {
        id: r.id,
        name: r.name
      };
    });
  });
};
