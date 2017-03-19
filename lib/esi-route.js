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
