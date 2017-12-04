jest.mock('../../internal/esi-agent');

import { API, makeAPI } from '../../../index';
import { ESIAgent } from '../../../internal/esi-agent';

let api: API = makeAPI();
// Cast to any to get the private agent property
let agent: ESIAgent = (api as any).agent;

afterEach(() => {
  agent.__reset();
});

test('Alliance.info', () => {
  agent.__expectRoute('get_alliances_alliance_id', { 'alliance_id': 1 });
  return api.alliances(1).info().then(result => {
    expect(result).toBeDefined();
  });
});

test('Alliance.corporations', () => {
  agent.__expectRoute('get_alliances_alliance_id_corporations',
      { 'alliance_id': 1 });
  return api.alliances(1).corporations().then(result => {
    expect(result).toBeDefined();
  });
});

test('Alliance.icon', () => {
  agent.__expectRoute('get_alliances_alliance_id_icons', { 'alliance_id': 1 });
  return api.alliances(1).icon().then(result => {
    expect(result).toBeDefined();
  });
});

test('Alliances.all', () => {
  agent.__expectRoute('get_alliances', {});
  return api.alliances().then(result => {
    expect(result).toBeDefined();
  });
});

test('Alliances.names empty', () => {
  agent.__expectRoute('get_alliances', {});
  agent.__expectRoute('get_alliances_names',
      { 'alliance_ids': [99000001, 99000002] });
  return api.alliances.names().then(result => {
    // Expect the results to be a Map with the keys
    expect(result).toBeInstanceOf(Map);
    expect(result.size).toBeGreaterThan(0);
  });
});

test('Alliances.names small', () => {
  agent.__expectRoute('get_alliances_names', { 'alliance_ids': [2] });
  return api.alliances.names([2]).then(result => {
    // Expect the results to be a Map with the keys
    expect(result).toBeInstanceOf(Map);
    expect(result.size).toBeGreaterThan(0);
  });
});

test('Alliances.names large', () => {
  let ids = [...new Array(130).keys()];
  agent.__expectRoute('post_universe_names', { 'ids': ids }, {
    returns: [
      {
        'id': 1, 'name': 'Test', 'category': 'alliance'
      }
    ]
  });
  return api.alliances.names(ids).then(result => {
    // Expect the results to be a Map with the keys
    expect(result).toBeInstanceOf(Map);
    expect(result.size).toBeGreaterThan(0);
  });
});

test('Alliances.search', () => {
  agent.__expectRoute('get_search', {
    'search': 'search text', 'categories': ['alliance'], 'strict': false
  });
  return api.alliances.search('search text').then(result => {
    // Expect the results to be an array
    expect(Array.isArray(result)).toBeTruthy();
  });
});

test('Alliances.search.strict', () => {
  agent.__expectRoute('get_search', {
    'search': 'search text', 'categories': ['alliance'], 'strict': true
  });
  return api.alliances.search.strict('search text').then(result => {
    // Expect the results to be an array
    expect(Array.isArray(result)).toBeTruthy();
  });
});
