// FIXME Document syntax examples for the different route parameter rules
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
      doclet.routeParams.push({name: parsed[0], rawRule: parsed[2] || ''});
    }
  });
};
