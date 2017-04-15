jest.mock('../../../internal/ESIAgent');

const Api = require('../../../Api');

let api = new Api();
let agent = api._esiAgent;

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

test('SolarSystems.all', () => {
  agent.__expectRoute('get_universe_systems', {});
  return api.solarSystems().then(result => {
    expect(result).toBeDefined();
  });
});


test('SolarSystems.names empty', () => {
  agent.__expectRoute('get_universe_systems', {});
  agent.__expectRoute('post_universe_names', { 'ids': [30000001] }, {
    returns: [
      {
        'id': 20000001,
        'name': 'Test',
        'category': 'solar_system'
      }
    ]
  });
  return api.solarSystems.names().then(result => {
    // Expect the results to be renamed
    expect(result.length).toBeGreaterThan(0);
    for (let n of result) {
      expect(Object.keys(n)).toEqual(['id', 'name']);
    }
  });
});

test('SolarSystems.names', () => {
  agent.__expectRoute('post_universe_names', { 'ids': [2] }, {
    returns: [
      {
        'id': 2,
        'name': 'Test',
        'category': 'solar_system'
      }
    ]
  });
  return api.solarSystems.names([2]).then(result => {
    // Expect the results to be renamed
    expect(result.length).toBeGreaterThan(0);
    for (let n of result) {
      expect(Object.keys(n)).toEqual(['id', 'name']);
    }
  });
});

test('SolarSystems.search', () => {
  agent.__expectRoute('get_search', {
    'search': 'search text',
    'categories': ['solarsystem'],
    'strict': false
  });
  return api.solarSystems.search('search text').then(result => {
    // Expect the results to be an array
    expect(Array.isArray(result)).toBeTruthy();
  });
});

test('SolarSystems.search.strict', () => {
  agent.__expectRoute('get_search', {
    'search': 'search text',
    'categories': ['solarsystem'],
    'strict': true
  });
  return api.solarSystems.search.strict('search text').then(result => {
    // Expect the results to be an array
    expect(Array.isArray(result)).toBeTruthy();
  });
});
