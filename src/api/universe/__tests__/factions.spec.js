jest.mock('../../../internal/esi-agent');

const API = require('../../../api');

let api = new API();
let agent = api._esiAgent;

afterEach(() => {
  agent.__reset();
});

test('Factions.all', () => {
  agent.__expectRoute('get_universe_factions', {});
  return api.factions().then(result => {
    expect(result).toBeDefined();
  });
});

test('Factions.search', () => {
  agent.__expectRoute('get_search', {
    'search': 'search text',
    'categories': ['faction'],
    'strict': false
  });
  return api.factions.search('search text').then(result => {
    // Expect the results to be an array
    expect(Array.isArray(result)).toBeTruthy();
  })
});

test('Factions.search.strict', () => {
  agent.__expectRoute('get_search', {
    'search': 'search text',
    'categories': ['faction'],
    'strict': true
  });
  return api.factions.search.strict('search text').then(result => {
    // Expect the results to be an array
    expect(Array.isArray(result)).toBeTruthy();
  })
});