jest.mock('../../../internal/esi-agent');

import { API, makeAPI } from '../../../api';
import { ESIAgent } from '../../../internal/esi-agent';

let api: API = makeAPI();
// Cast to any to get the private agent property
let agent: ESIAgent = (api as any).agent;

afterEach(() => {
  agent.__reset();
});

test('SolarSystem.info', () => {
  agent.__expectRoute('get_universe_systems_system_id', {
    'system_id': 1
  });
  return api.solarSystems(1).info().then(result => {
    expect(result).toBeDefined();
  });
});

test('SolarSystem.shortestRoute', () => {
  agent.__expectRoute('get_route_origin_destination', {
    'origin': 1,
    'destination': 2,
    'avoid': undefined,
    'connections': undefined,
    'flag': 'shortest'
  });
  return api.solarSystems(1).shortestRoute(2).then(result => {
    expect(result).toBeDefined();
  });
});

test('SolarSystem.shortestRoute custom', () => {
  agent.__expectRoute('get_route_origin_destination', {
    'origin': 1,
    'destination': 2,
    'avoid': [3, 4],
    'connections': [[5, 6], [6, 7], [7, 8]],
    'flag': 'shortest'
  });
  return api.solarSystems(1).shortestRoute(2, [3, 4], [5, 6, 7, 8])
  .then(result => {
    expect(result).toBeDefined();
  });
});

test('SolarSystem.secureRoute', () => {
  agent.__expectRoute('get_route_origin_destination', {
    'origin': 1,
    'destination': 2,
    'avoid': undefined,
    'connections': undefined,
    'flag': 'secure'
  });
  return api.solarSystems(1).secureRoute(2).then(result => {
    expect(result).toBeDefined();
  });
});

test('SolarSystem.secureRoute custom', () => {
  agent.__expectRoute('get_route_origin_destination', {
    'origin': 1,
    'destination': 2,
    'avoid': [3, 4],
    'connections': [[5, 6], [6, 7], [7, 8]],
    'flag': 'secure'
  });
  return api.solarSystems(1)
  .secureRoute(2, [3, 4], [5, 6, 7, 8])
  .then(result => {
    expect(result).toBeDefined();
  });
});

test('SolarSystem.insecureRoute', () => {
  agent.__expectRoute('get_route_origin_destination', {
    'origin': 1,
    'destination': 2,
    'avoid': undefined,
    'connections': undefined,
    'flag': 'insecure'
  });
  return api.solarSystems(1).insecureRoute(2).then(result => {
    expect(result).toBeDefined();
  });
});

test('SolarSystem.insecureRoute custom', () => {
  agent.__expectRoute('get_route_origin_destination', {
    'origin': 1,
    'destination': 2,
    'avoid': [3, 4],
    'connections': [[5, 6], [6, 7], [7, 8]],
    'flag': 'insecure'
  });
  return api.solarSystems(1)
  .insecureRoute(2, [3, 4], [5, 6, 7, 8])
  .then(result => {
    expect(result).toBeDefined();
  });
});

test('SolarSystems.all', () => {
  agent.__expectRoute('get_universe_systems', {});
  return api.solarSystems().then(result => {
    expect(result).toBeDefined();
  });
});

test('SolarSystems.jumpStats', () => {
  agent.__expectRoute('get_universe_system_jumps', {});
  return api.solarSystems.jumpStats().then(result => {
    expect(result).toBeDefined();
  });
});

test('SolarSystems.killStats', () => {
  agent.__expectRoute('get_universe_system_kills', {});
  return api.solarSystems.killStats().then(result => {
    expect(result).toBeDefined();
  });
});

test('SolarSystems.names empty', () => {
  agent.__expectRoute('get_universe_systems', {});
  agent.__expectRoute('post_universe_names', { 'ids': [30000001, 30000002] }, {
    returns: [
      {
        'id': 20000001, 'name': 'Test', 'category': 'solar_system'
      }
    ]
  });
  return api.solarSystems.names().then(result => {
    // Expect the results to be a Map with the keys
    expect(result).toBeInstanceOf(Map);
    expect(result.size).toBeGreaterThan(0);
  });
});

test('SolarSystems.names', () => {
  agent.__expectRoute('post_universe_names', { 'ids': [2] }, {
    returns: [
      {
        'id': 2, 'name': 'Test', 'category': 'solar_system'
      }
    ]
  });
  return api.solarSystems.names([2]).then(result => {
    // Expect the results to be a Map with the keys
    expect(result).toBeInstanceOf(Map);
    expect(result.size).toBeGreaterThan(0);
  });
});

test('SolarSystems.search', () => {
  agent.__expectRoute('get_search', {
    'search': 'search text', 'categories': ['solarsystem'], 'strict': false
  });
  return api.solarSystems.search('search text').then(result => {
    // Expect the results to be an array
    expect(Array.isArray(result)).toBeTruthy();
  });
});

test('SolarSystems.search.strict', () => {
  agent.__expectRoute('get_search', {
    'search': 'search text', 'categories': ['solarsystem'], 'strict': true
  });
  return api.solarSystems.search.strict('search text').then(result => {
    // Expect the results to be an array
    expect(Array.isArray(result)).toBeTruthy();
  });
});
