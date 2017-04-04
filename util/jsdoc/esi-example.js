/**
 * Defines the `@esi_example` tag that provides an example code snippet for use
 * in the home page documentation and description of a function. This is
 * expected to be used in conjunction with the `esi-homepage` doclet plugin, and
 * optionally the `@esi_route` tag.
 *
 * If a doclet has an `@esi_route` tag then there is no need to include the
 * route id with this tag (although the route id must be provided if the doclet
 * is not using the `@esi_route` tag for generation).
 *
 * Syntax:
 *
 * - `@esi_example code`: Links the JS snippet `code` to the route provided by
 * a `@esi_route` tag, and no additional key.
 * - `@esi_example code key`: Links the JS snippet `code` to the route provided
 * by a `@esi_route` tag, with the additional specialization `key`.
 * - `@esi_example code key route_id`: Links the JS snippet `code` to the route
 * with id `route_id` and specialization `key`.
 * - `@esi_example code ~ route_id`: Links the JS snippet `code` to the route
 * with id `route_id`, but no additional key.
 */

const handleTag = require('./jsdoc-desc-helper');

module.exports.defineTags = exports.defineTags = function(dictionary) {
  dictionary.defineTag('esi_example', {
    canHaveName: false,
    canHaveType: false,
    mustNotHaveDescription: true,
    mustHaveValue: true,
    onTagged: function(doclet, tag) {
      if (!doclet.routeExamples) {
        doclet.routeExamples = [];
      }

      let example = handleTag(doclet, tag, 1, 3);
      doclet.routeExamples.push({
        code: example[0],
        key: (example[1] == '~' ? '' : example[1]),
        route: example[2]
      });
    }
  });
};
