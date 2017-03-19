const path = require('path');
const fs = require('fs');
const markdown = require('jsdoc/util/markdown');

const SwaggerAPI = require('./SwaggerAPI');

let env = require('jsdoc/env');

let api = SwaggerAPI.getLocalAPI();

module.exports.handlers = exports.handlers = {
  processingComplete: function(e) {
    let examples = [];

    for (let doclet of e.doclets) {
      if (doclet.routeExamples || doclet.route) {
        examples.push(...collectExamples(doclet));
      }
    }

    examples.push(...getUnimplementedExamples(examples));

    examples.sort((a, b) => {
      if (a.sortKey < b.sortKey) {
        return -1;
      } else if (a.sortKey > b.sortKey) {
        return 1;
      } else {
        return 0;
      }
    });

    let template = fs.readFileSync(path.join(__dirname, '../home.md'), {encoding: 'utf8'});

    let final = template.replace(/\{esi-examples}/g, generateExampleTableMarkdown(examples));
    final = final.replace(/\{esi-sso}/g, generateSSOTable());
    final = final.replace(/\{esi-oauth-url}/g, generateURL(api.ssoURL));
    final = final.replace(/\{esi-version}/g, api.version);
    final = final.replace(/\{package-version}/g, process.env.npm_package_version);
    final = final.replace(/\{package-name}/g, process.env.npm_package_name);

    let parser = markdown.getParser();
    env.opts.readme = parser(final);
  }
};

function generateURL(url) {
  return '[' + url + '](' + url + ')';
}

function generateSSOTable() {
  let md = '| SSO Scope | Description |\n';
  md += '| --------- | ----------- |';
  for (let scope of api.ssoScopes) {
    md += '\n| `' + scope + '` | ' + api.scopeDescription(scope) + ' |';
  }
  return md;
}

function generateExampleTableMarkdown(examples) {
  let md = '| ESI URL | Version | JS Function | Example |\n';
  md += '| ------- | ------- | ----------- | ------- |';

  for (let ex of examples) {
    md += '\n| ';

    // Note &mdash; is used instead of --- since the jsdoc md parser doesn't
    // convert that properly.
    if (ex.esiURL) {
      md += '[`' + ex.esiText + '`](' + ex.esiURL + ') | ';
    } else {
      md += ' &mdash; | ';
    }

    if (ex.version) {
      md += '`' + ex.version + '` | ';
    } else {
      md += ' &mdash; | ';
    }

    if (ex.jsdocURL) {
      md += '[`' + ex.jsdocText + '`](' + ex.jsdocURL + ') | ';
    } else {
      md += ' &mdash; | ';
    }

    if (ex.code) {
      md += '`' + ex.code + '` |';
    } else {
      md += ' &mdash; |';
    }
  }

  return md;
}

function esiRouteText(route) {
  return route.httpMethod.toUpperCase() + ' ' + route.path;
}

function sortKey(route) {
  return route ? route.path + route.httpMethod : '-';
}

function getUnimplementedExamples(examples) {
  let providedRoutes = {};
  for (let ex of examples) {
    if (ex.route) {
      providedRoutes[ex.route] = ex;
    }
  }

  let newExamples = [];
  for (let id of api.routeNames) {
    if (!(id in providedRoutes)) {
      let route = api.route(id);
      newExamples.push({
        route: id,
        esiText:  esiRouteText(route),
        esiURL: route.docURL,
        version: route.version,
        sortKey: sortKey(route),
        jsdocText: null,
        jsdocURL: null,
        code: null
      });
    }
  }

  return newExamples;
}

function collectExamples(doclet) {
  let examples = [];

  let defaultRoute = doclet.route;

  if (doclet.routeExamples) {
    for (let ex of doclet.routeExamples) {
      let route = defaultRoute;
      if (ex.route) {
        route = api.route(ex.route);
      }

      let row = {
        route: null,
        esiText: null,
        esiURL: null,
        version: null,
        sortKey: sortKey(route),
        jsdocText: doclet.memberof + '.' + doclet.name + '()',
        jsdocURL: doclet.memberof + '.html#' + doclet.name,
        code: ex.code
      };

      if (route) {
        let esiText = esiRouteText(route);
        if (ex.key) {
          esiText += '?' + ex.key;
        }

        row.route = route.id;
        row.esiText = esiText;
        row.esiURL = route.docURL;
        row.version = route.version;
      }

      examples.push(row);
    }
  } else {
    // Include the route but without any example snippet
    examples.push({
      route: defaultRoute.id,
      esiText: esiRouteText(defaultRoute),
      esiURL: defaultRoute.docURL,
      version: defaultRoute.version,
      sortKey: sortKey(defaultRoute),
      jsdocText: doclet.memberof + '.' + doclet.name + '()',
      jsdocURL: doclet.memberof + '.html#' + doclet.name,
      code: null
    });
  }

  return examples;
}