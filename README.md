# Eve Swagger Interface

## An OpenAPI for EVE Online

JavaScript client for [ESI](https://developers.eveonline.com/blog/article/introducing-the-esi-api) compatible with NodeJS.
The client returns a developer friendly set of functions that return promises resolving to the response from ESI endpoint.
The underlying client library is generated by [Swagger Codegen](https://github.com/swagger-api/swagger-codegen).

- Documentation: https://lhkbob.github.io/eve-swagger-js

## Installation

### For [Node.js](https://nodejs.org/)

Currently, this library has not been published to the `npm` repository.
However, it can still be depended on in NodeJS projects by including a dependency in `package.json` using a GitHub URL.
A specific release can be requested by appending, e.g. `#0.2.0`, to the end of the URL:

```json
"dependencies": {
   "eve_swagger_interface": "git://github.com/lhkbob/eve-swagger-js.git#0.2.0",
}
```
