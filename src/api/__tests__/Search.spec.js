jest.mock('../../internal/ESIAgent');

const Api = require('../../Api');
const Search = require('../Search');

let api = new Api();
let agent = api._esiAgent;

afterEach(() => {
  agent.__reset();
});

// Only test the category-less versions for no-auth and auth searches.
// Other variants are tested in the category-specific class.

test('Search all-categories, no token', () => {
  agent.__expectRoute('get_search', {
    'categories': [
      'agent',
      'alliance',
      'character',
      'constellation',
      'corporation',
      'faction',
      'inventoryType',
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

test('Search all-categories, no token, strict', () => {
  agent.__expectRoute('get_search', {
    'categories': [
      'agent',
      'alliance',
      'character',
      'constellation',
      'corporation',
      'faction',
      'inventoryType',
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

test('Search all-categories, with token', () => {
  agent.__expectRoute('get_characters_character_id_search', {
    'character_id': 1,
    'categories': [
      'agent',
      'alliance',
      'character',
      'constellation',
      'corporation',
      'faction',
      'inventoryType',
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

test('Search all-categories, with token, strict', () => {
  agent.__expectRoute('get_characters_character_id_search', {
    'character_id': 1,
    'categories': [
      'agent',
      'alliance',
      'character',
      'constellation',
      'corporation',
      'faction',
      'inventoryType',
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