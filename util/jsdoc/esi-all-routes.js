const path = require('path');
const fs = require('fs');

module.exports.handlers = exports.handlers = {
  processingComplete: function(e) {
    let all_routes = [];

    for (let doclet of e.doclets) {
      if (doclet.route && !all_routes.includes(doclet.route.id)) {
        all_routes.push(doclet.route.id);
      }
    }

    fs.writeFileSync(path.join(__dirname, '../implemented-routes.json'),
        JSON.stringify(all_routes, null, ' '), { encoding: 'utf8' });
  }
};