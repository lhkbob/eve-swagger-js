jest.mock('../../../internal/ESIAgent');

const Api = require('../../../Api');

let api = new Api();
let agent = api._esiAgent;

afterEach(() => {
  agent.__reset();
});

test('Wormholes.search', () => {
  agent.__expectRoute('get_search', {
    'search': 'search text',
    'categories': ['wormhole'],
    'strict': false
  });
  return api.wormholes.search('search text').then(result => {
    // Expect the results to be an array
    expect(Array.isArray(result)).toBeTruthy();
  });
});

test('Wormholes.search.strict', () => {
  agent.__expectRoute('get_search', {
    'search': 'search text',
    'categories': ['wormhole'],
    'strict': true
  });
  return api.wormholes.search.strict('search text').then(result => {
    // Expect the results to be an array
    expect(Array.isArray(result)).toBeTruthy();
  });
});
