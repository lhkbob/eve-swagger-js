import * as fs from 'fs';
import * as path from 'path';

import {makeAPI} from '../api';
import * as swagger from '../../util/esi-api';

const swaggerImpl = swagger.API.getLocalAPI();
const swaggerLatest = swagger.API.getRemoteAPI();

let implementedRoutes :string[] = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../../util/implemented-routes.json'),
        { encoding: 'utf8' }));
// Manually add these routes, which are defined and used but don't have
// a documentation call out
implementedRoutes.push('get_characters_character_id_search');

test.skip('Swagger version', () => {
  expect(swaggerImpl.version).toEqual(swaggerLatest.version);
});

test.skip('Swagger routes', () => {
  let missingRoutes = [];
  for (let route of swaggerLatest.routeIDs) {
    if (!implementedRoutes.includes(route)) {
      missingRoutes.push(route);
    }
  }
  expect(missingRoutes).toEqual([]);

  let delRoutes = [];
  for (let route of implementedRoutes) {
    if (!swaggerLatest.routeIDs.includes(route)) {
      delRoutes.push(route);
    }
  }
  expect(delRoutes).toEqual([]);
});

test('Integration test', () => {
  let esi = makeAPI();
  return esi.characters(92755159).info().then(result => {
    expect(result.name).toEqual('Ziggs Boson');
  });
});

test('Cache and throttle', () => {
  let limitedESI = makeAPI({
    minTimeBetweenRequests: 2000,
    maxConcurrentRequests: 1
  });
  let firstRequestTime;

  // Make the first request, which should not be throttled nor cached
  return limitedESI.characters(92755159).info().then(result => {
    firstRequestTime = new Date().getTime();
    expect(result.name).toEqual('Ziggs Boson');
    // Make second request to the same end point, which should complete
    // almost immediately since it's cached (bypassing the throttle)
    return limitedESI.characters(92755159).info();
  }).then(result => {
    expect(result.name).toEqual('Ziggs Boson');
    let elapsedTime = Math.abs(new Date().getTime() - firstRequestTime);
    expect(elapsedTime).toBeLessThan(100);

    // Make a third request to a new end point, which should complete
    // approximately 2 seconds after the first request
    return limitedESI.corporations(result.corporation_id).info();
  }).then(result => {
    expect(result.corporation_name).toEqual('Nobody in Local');
    let elapsedTime = Math.abs(new Date().getTime() - firstRequestTime);
    expect(elapsedTime).toBeGreaterThan(1700);
    expect(elapsedTime).toBeLessThan(2800);
  });
});
