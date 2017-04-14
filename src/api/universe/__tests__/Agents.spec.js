jest.mock('../../internal/ESIAgent');

const Api = require('../../../Api');

let api = new Api();
let agent = api._esiAgent;

test('Agents.search', () => {
  agent.__expectRoute('get_search', {
    'search': 'search text',
    'categories': ['agent'],
    'strict': false
  });
  return api.agents.search('search text').then(result => {
    // Expect the results to be an array
    expect(Array.isArray(result)).toBeTruthy();
  })
});

test('Agents.search.strict', () => {
  agent.__expectRoute('get_search', {
    'search': 'search text',
    'categories': ['agent'],
    'strict': true
  });
  return api.agents.search.strict('search text').then(result => {
    // Expect the results to be an array
    expect(Array.isArray(result)).toBeTruthy();
  })
});
