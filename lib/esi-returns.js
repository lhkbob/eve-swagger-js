// FIXME document syntax for the different route responses

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
