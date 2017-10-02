jest.mock('../../../internal/esi-agent');

import { API, makeAPI } from '../../../index';
import { ESIAgent } from '../../../internal/esi-agent';

let api: API = makeAPI();
// Cast to any to get the private agent property
let agent: ESIAgent = (api as any).agent;

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
