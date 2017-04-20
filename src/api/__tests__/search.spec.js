jest.mock('../../internal/esi-agent');

const API = require('../../api');
const Search = require('../search');

let api = new API();
let agent = api._esiAgent;

afterEach(() => {
  agent.__reset();
});

// Only test the category-less versions for no-auth and auth searches.
// Other variants are tested in the category-specific class.

test('Search.get', () => {
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
    ],
    'search': 'query text',
    'strict': false
  });
  let s = new Search(agent);
  return s.get('query text').then(result => {
    expect(result).toBeDefined();
    // When all categories are used, an object with category keys is returned
    expect(Array.isArray(result)).toBeFalsy();
  });
});

test('Search.strict', () => {
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
    ],
    'search': 'query text',
    'strict': true
  });
  let s = new Search(agent);
  return s.strict('query text').then(result => {
    expect(result).toBeDefined();
    // When all categories are used, an object with category keys is returned
    expect(Array.isArray(result)).toBeFalsy();
  });
});

test('Search.get for character', () => {
  agent.__expectRoute('get_characters_character_id_search', {
    'character_id': 1,
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
      'wormhole',
      'structure'
    ],
    'search': 'query text',
    'strict': false
  }, { token: 'token' });
  let s = new Search(agent, [], 1, 'token');
  return s.get('query text').then(result => {
    expect(result).toBeDefined();
    // When all categories are used, an object with category keys is returned
    expect(Array.isArray(result)).toBeFalsy();
  });
});

test('Search.strict for character', () => {
  agent.__expectRoute('get_characters_character_id_search', {
    'character_id': 1,
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
      'wormhole',
      'structure'
    ],
    'search': 'query text',
    'strict': true
  }, { token: 'token' });
  let s = new Search(agent, [], 1, 'token');
  return s.strict('query text').then(result => {
    expect(result).toBeDefined();
    // When all categories are used, an object with category keys is returned
    expect(Array.isArray(result)).toBeFalsy();
  });
});