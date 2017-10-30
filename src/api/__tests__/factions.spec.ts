jest.mock('../../../internal/esi-agent');

import { API, makeAPI } from '../../index';
import { ESIAgent } from '../../internal/esi-agent';

let api: API = makeAPI();
// Cast to any to get the private agent property
let agent: ESIAgent = (api as any).agent;

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