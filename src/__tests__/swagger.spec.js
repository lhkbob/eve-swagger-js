const fs = require('fs');
const path = require('path');

const SwaggerAPI = require('../../util/swagger-api');
const esi = require('../index');

let swaggerImpl = SwaggerAPI.getLocalAPI();
let swaggerLatest = SwaggerAPI.getRemoteAPI();

let implementedRoutes = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../../util/implemented-routes.json'),
        { encoding: 'utf8' }));

test('Swagger version', () => {
  expect(swaggerImpl.version).toEqual(swaggerLatest.version);
});

test('Swagger routes', () => {
  for (let route of swaggerLatest.routeNames) {
    if (!implementedRoutes.includes(route)) {
      // Weird expectation to create a better error message
      expect('New route is not implemented: ' + route).toEqual('');
    } else {
      // Confirm that version hasn't changed
      expect(swaggerImpl.route(route).version)
      .toEqual(swaggerLatest.route(route).version);
    }
  }

  for (let route of implementedRoutes) {
    if (!swaggerLatest.routeNames.includes(route)) {
      expect('Old route is no longer defined: ' + route).toEqual('');
    }
  }
});

test('Integration test', () => {
  return esi.characters(92755159).info().then(result => {
    expect(result.name).toEqual('Ziggs Boson');
  });
});
