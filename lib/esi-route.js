/**
 * Define the `@esi_route` tag that specifies the ESI Swagger route that a
 * function invokes. This must be used in conjunction with the `esi-description`
 * doclet plugin to produce generated documentation. It can be combined with
 * `@esi_param` and `@esi_returns` tags to modify how the documentation is
 * generated for a function. The `@esi_route` tag must have a single value that
 * specifies the route id, e.g. `post_universe_names`.
 */

const path = require('path');
const fs = require('fs');
const logger = require('jsdoc/util/logger');

const SwaggerAPI = require('./SwaggerAPI');
const handleTag = require('./jsdoc-desc-helper');

let api = new SwaggerAPI(fs.readFileSync(path.join(__dirname, './swagger.json')));

module.exports.defineTags = exports.defineTags = function(dictionary) {
  dictionary.defineTag('esi_route', {
    canHaveName: false,
    canHaveType: false,
    mustNotHaveDescription: true,
    mustHaveValue: true,
    onTagged: function(doclet, tag) {
      try {
        let routeName = handleTag(doclet, tag, 1, 1)[0];
        doclet.route = api.route(routeName);
      } catch(e) {
        logger.warn('Error handling esi_route tag in', doclet.longname, ':', e.message);
      }
    }
  });
};
