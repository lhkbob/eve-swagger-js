const Promise = require('bluebird');

function splitIds(ids) {
  let groups = [];

  while (ids.length > 500) {
    groups.push(ids.splice(0, 500));
  }

  if (ids.length > 0) {
    groups.push(ids);
  }

  return groups;
}

function getFilteredNames(api, ids, category) {
  return api.noAuth.post('/v2/universe/names/', { body: ids })
  .then(result => {
    if (category != 'all') {
      // Filter by category and remove the category field
      return result.filter(r => r.category == category).map(r => {
        return {
          id: r.id,
          name: r.name
        };
      });
    } else {
      return result;
    }
  });
}


/**
 * Internal utility function to query names of a given set of `ids`. Although
 * the ESI end point allows returning mixed types, this returns names
 * corresponding to only a single type specified by `category`. This makes an
 * HTTP POST request to
 * [`/universe/names/`](https://esi.tech.ccp.is/latest/#!/Universe/post_universe_names).
 *
 * The request is returned as an asynchronous Promise that resolves to an
 * object
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
 * # `'all'` to disable category filtering (in which case `category` is
 * included` in each result element
 *
 * @param api {ESIAgent} Internal api
 * @param category {String} Category to filter names to
 * @param ids {Array.<Number>} Ids to look up
 * @returns {Promise}
 * @private
 */
module.exports = function(api, category, ids) {
  let groups = splitIds(ids);
  return Promise.map(groups, idSet => getFilteredNames(api, idSet, category))
  .then(nameSets => {
    // Join each group of names into a single array
    let combined = [];
    for (let set of nameSets) {
      combined = combined.concat(set);
    }

    return combined;
  });
};
