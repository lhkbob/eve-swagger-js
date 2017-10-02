jest.mock('../internal/esi-agent');

import { API, makeAPI } from '../index';
import { ESIAgent } from '../internal/esi-agent';

let api: API = makeAPI();
// Cast to any to get the private agent property
let agent: ESIAgent = (api as any).agent;

afterEach(() => {
  agent.__reset();
});

test('API.status', () => {
  agent.__expectRoute('get_status', {});
  return api.status().then(result => {
    expect(result).toBeDefined();
  });
});

test('API.names', () => {
  agent.__expectRoute('post_universe_names', { 'ids': [2] });
  return api.names([2]).then(result => {
    expect(result.length).toBeGreaterThan(0);
    for (let e of result) {
      expect(Object.keys(e)).toEqual(['category', 'id', 'name']);
    }
  });
});

test('API.names long', () => {
  let ids = [...new Array(1030).keys()];

  agent.__expectRoute('post_universe_names', { 'ids': ids.slice(0, 500) });
  agent.__expectRoute('post_universe_names', { 'ids': ids.slice(500, 1000) });
  agent.__expectRoute('post_universe_names', { 'ids': ids.slice(1000, 1030) });

  return api.names(ids).then(result => {
    // Each post_universe_names only returns two items with the mock agent
    expect(result.length).toEqual(6);
    for (let e of result) {
      expect(Object.keys(e)).toEqual(['category', 'id', 'name']);
    }
  });
});

test('API.search', () => {
  agent.__expectRoute('get_search', {
    'categories': [
      'agent',
      'alliance',
      'character',
      'constellation',
      'corporation',
      'faction',
      'inventorytype',
      'region',
      'solarsystem',
      'station',
      'wormhole'
    ], 'search': 'query text', 'strict': false
  });
  return api.search('query text').then(result => {
    // The example object has station and solarsystem ids
    expect(result.station).toBeDefined();
    expect(result.solarsystem).toBeDefined();
  });
});

test('API.search strict', () => {
  agent.__expectRoute('get_search', {
    'categories': [
      'agent',
      'alliance',
      'character',
      'constellation',
      'corporation',
      'faction',
      'inventorytype',
      'region',
      'solarsystem',
      'station',
      'wormhole'
    ], 'search': 'query text', 'strict': true
  });
  return api.search('query text', true).then(result => {
    // The example object has station and solarsystem ids
    expect(result.station).toBeDefined();
    expect(result.solarsystem).toBeDefined();
  });
});
