/**
 * Defines the `@esi_returns` tag that describes how the response of an ESI
 * request is modified before its Promise is resolved. This is used in
 * conjunction with the `@esi_route` tag and the `esi-description` doclet
 * plugin.
 * `@esi_returns` has a flexible format that specifies how the ESI response
 * is documented and handled by the function.
 *
 * + `@esi_returns name`: Returns only the `name` property from the response
 * object, or an array of `name` properties selected from the object elements
 * of an array response.
 * + `@esi_returns id:name`: Returns a specialized selection that assumes the
 * `name` property describes the ID of a created resource.
 * + `@esi_returns none`: Returns an empty object, any ESI response is squashed
 * + `@esi_returns {name: newName, !name2, ...}`: Remap the `name` property of
 * the response object (or elements in an array) to `newName`, and remove the
 * `name2` property. All other properties are left unchanged.
 */

const handleTag = require('./jsdoc-desc-helper');

module.exports.defineTags = exports.defineTags = function(dictionary) {
  dictionary.defineTag('esi_returns', {
    canHaveName: false,
    canHaveType: false,
    mustNotHaveDescription: true,
    mustHaveValue: true,
    onTagged: function(doclet, tag) {
      if (!doclet.routeResponses) {
        doclet.routeResponses = [];
      }

      let rule = handleTag(doclet, tag, 0, 1);
      doclet.routeResponses.push(rule[0] || '');
    }
  });
};
