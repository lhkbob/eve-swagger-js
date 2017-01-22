/*
 * Define an esi_link tag. This is a bit of a hack but it allows us to include a
 * link to a relative path (which jsdoc fails to recognize as a valid URL), and
 * it doesn't require modifying a template. Additionally, by adding directly to
 * the description, it works when docs are generated as markdown.
 *
 * This inserts a statement directing to the generated markdown documentation
 * produced by swagger-codegen.
 */
exports.defineTags = function(dictionary) {
  dictionary.defineTag('esi_link', {
    mustHaveValue: true,
    mustNotHaveDescription: true,
    onTagged: function(doclet, tag) {
      var value = tag.value;
      var period = value.indexOf('.');

      var url = 'https://github.com/lhkbob/eve-swagger-js/blob/master/generated/docs/';
      if (period >= 0) {
        // Class and method name provided
        var base = value.substring(0, period);
        var method = value.substring(period + 1);
        url = url + base + '.md#' + method;
      } else {
        // Assume it's just a class
        url = url + value + '.md';
      }

      var linkText = '\nThis promisifies a call to the generated [' + value
          + '](' + url + ').';
      doclet.description = doclet.description + linkText;
    }
  });
};
