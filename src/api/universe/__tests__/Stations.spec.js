jest.mock('../../../internal/ESIAgent');

const Api = require('../../../Api');

let api = new Api();
let agent = api._esiAgent;

afterEach(() => {
  agent.__reset();
});

test('Station.info', () => {
  agent.__expectRoute('get_universe_stations_station_id', {
    'station_id': 1
  });
  return api.stations(1).info().then(result => {
    expect(result).toBeDefined();
  });
});

test('Stations.names', () => {
  agent.__expectRoute('post_universe_names', { 'ids': [2] }, {
    returns: [
      {
        'id': 2,
        'name': 'Test',
        'category': 'station'
      }
    ]
  });
  return api.stations.names([2]).then(result => {
    // Expect the results to be renamed
    expect(result.length).toBeGreaterThan(0);
    for (let n of result) {
      expect(Object.keys(n)).toEqual(['id', 'name']);
    }
  });
});

test('Stations.search', () => {
  agent.__expectRoute('get_search', {
    'search': 'search text',
    'categories': ['station'],
    'strict': false
  });
  return api.stations.search('search text').then(result => {
    // Expect the results to be an array
    expect(Array.isArray(result)).toBeTruthy();
  });
});

test('Stations.search.strict', () => {
  agent.__expectRoute('get_search', {
    'search': 'search text',
    'categories': ['station'],
    'strict': true
  });
  return api.stations.search.strict('search text').then(result => {
    // Expect the results to be an array
    expect(Array.isArray(result)).toBeTruthy();
  });
});
