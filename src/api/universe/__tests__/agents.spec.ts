jest.mock('../../../internal/esi-agent');

import { API, makeAPI } from '../../../api';
import { ESIAgent } from '../../../internal/esi-agent';

let api: API = makeAPI();
// Cast to any to get the private agent property
let agent: ESIAgent = (api as any).agent;

afterEach(() => {
  agent.__reset();
});

test('Agents.search', () => {
  agent.__expectRoute('get_search', {
    'search': 'search text',
    'categories': ['agent'],
    'strict': false
  });
  return api.agents.search('search text').then(result => {
    // Expect the results to be an array
    expect(Array.isArray(result)).toBeTruthy();
  });
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
  });
});
