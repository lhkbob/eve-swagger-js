# {package-name}

## JS Client for the Eve Swagger Interface (ESI)

JavaScript client for
[ESI](https://developers.eveonline.com/blog/article/introducing-the-esi-api)
compatible with NodeJS. The client returns a developer friendly set of
functions that return [Promises](https://bluebirdjs.com) resolving to
the response from the ESI endpoint.

The versioning of this library is independent of the ESI version.
Because this is a client adapter, it is possible that certain routes
are perfectly usable even when an ESI update changes other routes.
The library uses specific route versions for each end point instead of
the legacy, latest, or dev aliases.

- Package name: {package-name}
- Package version: {package-version}
- ESI version: {esi-version}
- Source: [https://github.com/lhkbob/eve-swagger-js/](https://github.com/lhkbob/eve-swagger-js/)
- Documentation: [https://lhkbob.github.io/eve-swagger-js/](https://lhkbob.github.io/eve-swagger-js/)


## Installation

### For [Node.js](https://nodejs.org/)

The library is published to `npm` as
[eve-swagger](https://www.npmjs.com/package/eve-swagger). It can be
depended on as usual by running `npm install --save {package-name}`,
or by including in your `package.json`:

```json
"dependencies": {
   "{package-name}": "^{package-version}",
}
```

## Getting Started

Please follow the [Installation](#installation) instruction and execute
the following JS code. All ESI end points and their code mappings are
provided in the subsequent [ESI Mappings](#esi-mappings) section.

```javascript
// The main module returns a default Api instance with an attached
// Api constructor if configuration changes are necessary.
let esi = require('{package-name}');

// Creating a new Api instance with a different configuration.
// All options, with their default values, are shown below.
let esi2 = esi({
    service: 'https://esi.evetech.net',
    source: 'tranquility',
    agent: 'eve-swagger | https://github.com/lhkbob/eve-swagger-js',
    language: 'en-us',
    timeout: 6000,
    minTime: 0,
    maxConcurrent: 0
  });

// Fetch all active alliance ids (could also call 'esi.alliances.all()')
esi.alliances().then(result => {
  console.log(result);
}).catch(error => {
  console.error(error);
});
```

## ESI Mappings

The following table lists the mapping from ESI route end point to the
function in the library that contacts that route. It also contains the
version of the route that this library is coded to use (on a per-route
basis as recommended by CCP) and an example snippet showing how to
call the linked function.

{esi-examples}

## SSO Token Authorization

Numerous functions require user authorization. EVE and ESI manage this
via access tokens that have been verified between the user, app, and EVE
using the OAuth protocol. When an app requests a token for a user it
specifies a number of scopes that it requires to successfully operate.
These scopes allow for compartmentalization between a user's various
in-game data, enabling apps to only have access to what they need.

All end points that require authentication via a token are exposed by
calling `esi.characters(id, token)`. The returned `Character` instance
and child adapters will then use that token for all requests. This
instance can be saved by the app if the app's purpose focuses on a
limited set of characters. Otherwise the created `Character` instances
are lightweight enough that it can be called each time a new character
must be accessed. This module does not provide any tools for acquiring
evesso tokens.

The OAuth verification is made against {esi-oauth-url}, although this
is the responsibility of the app that wishes to use this library.
`eve-swagger-js` does not provide any OAuth support.

### Available Scopes

{esi-sso}
