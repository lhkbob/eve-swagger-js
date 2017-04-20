jest.mock('../../../internal/esi-agent');

const API = require('../../../api');

let api = new API();
let agent = api._esiAgent;

afterEach(() => {
  agent.__reset();
});

test('Constellation.info', () => {
  agent.__expectRoute('get_universe_constellations_constellation_id', {
    'constellation_id': 1
  });
  return api.constellations(1).info().then(result => {
    expect(result).toBeDefined();
  });
});

test('Constellations.all', () => {
  agent.__expectRoute('get_universe_constellations', {});
  return api.constellations().then(result => {
    expect(result).toBeDefined();
  });
});


test('Constellations.names empty', () => {
  agent.__expectRoute('get_universe_constellations', {});
  agent.__expectRoute('post_universe_names', { 'ids': [20000001] }, {
    returns: [
      {
        'id': 20000001,
        'name': 'Test',
        'category': 'constellation'
      }
    ]
  });
  return api.constellations.names().then(result => {
    // Expect the results to be renamed
    expect(result.length).toBeGreaterThan(0);
    for (let n of result) {
      expect(Object.keys(n)).toEqual(['id', 'name']);
    }
  });
});

test('Constellations.names', () => {
  agent.__expectRoute('post_universe_names', { 'ids': [2] }, {
    returns: [
      {
        'id': 2,
        'name': 'Test',
        'category': 'constellation'
      }
    ]
  });
  return api.constellations.names([2]).then(result => {
    // Expect the results to be renamed
    expect(result.length).toBeGreaterThan(0);
    for (let n of result) {
      expect(Object.keys(n)).toEqual(['id', 'name']);
    }
  });
});

test('Constellations.search', () => {
  agent.__expectRoute('get_search', {
    'search': 'search text',
    'categories': ['constellation'],
    'strict': false
  });
  return api.constellations.search('search text').then(result => {
    // Expect the results to be an array
    expect(Array.isArray(result)).toBeTruthy();
  });
});

test('Constellations.search.strict', () => {
  agent.__expectRoute('get_search', {
    'search': 'search text',
    'categories': ['constellation'],
    'strict': true
  });
  return api.constellations.search.strict('search text').then(result => {
    // Expect the results to be an array
    expect(Array.isArray(result)).toBeTruthy();
  });
});
