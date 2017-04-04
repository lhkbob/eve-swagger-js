/**
 * Defines the `@esi_param` jsdoc tag. This works in conjunction with the
 * `@esi_route` tag and the `esi-description` doclet plugin to help
 * automatically generate human-readable documentation for a function that
 * makes an ESI query.
 * `@esi_param` has a flexible format that specifies how an ESI route parameter
 * is documented and handled by the function.
 *
 * + `@esi_param name`: Force the inclusion of the `name` parameter in the
 * documentation.
 * + `@esi_param !name`: Ignore the `name` parameter in the route
 * + `@esi_param name - arg`: Specify that the `name` parameter maps to the
 * function argument `arg`.
 * + `@esi_param name - value`: Specify that the `name` parameter has a
 * hard-coded value (must be valid JSON syntax).
 * + `@esi_param name - {prop1: arg, prop2: value, ...}`: Decompose the `name`
 * object parameter, so that `prop1` maps to function argument `arg`, and
 * `prop2` is hard-coded to the JSON value. Additional properties can also be
 * mapped, but sub-properties are not supported.
 */

const logger = require('jsdoc/util/logger');

const handleTag = require('./jsdoc-desc-helper');

module.exports.defineTags = exports.defineTags = function(dictionary) {
  dictionary.defineTag('esi_param', {
    canHaveName: false,
    canHaveType: false,
    mustNotHaveDescription: true,
    mustHaveValue: true,
    onTagged: function(doclet, tag) {
      if (!doclet.routeParams) {
        doclet.routeParams = [];
      }

      let parsed = handleTag(doclet, tag, 1, 3);
      if (parsed[1] != null) {
        // Make sure it fits the hyphen syntax
        if (parsed[1] != '-' || parsed[2] == null) {
          logger.warn('Bad syntax for esi_param tag', parsed);
          return;
        }
      }
      doclet.routeParams.push({
        name: parsed[0],
        rawRule: parsed[2] || ''
      });
    }
  });
};
