jest.mock('../../internal/esi-agent');

import { esi } from '../../internal/esi-types';
import { API, makeAPI } from '../../index';
import { ESIAgent } from '../../internal/esi-agent';
import {
  Search,
  makeDefaultSearch,
  makeCharacterSearch
} from '../../internal/search';

let api: API = makeAPI();
// Cast to any to get the private agent property
let agent: ESIAgent = (api as any).agent;

afterEach(() => {
  agent.__reset();
});

// Only test the category-less versions for no-auth and auth searches.
// Other variants are tested in the category-specific class.

test('Search.get', () => {
  agent.__expectRoute('get_search', {
    'categories': [
      'agent'
    ], 'search': 'query text', 'strict': false
  });
  let s = makeDefaultSearch(agent, esi.SearchCategory.AGENT);
  return s('query text').then(result => {
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBeTruthy();
  });
});

test('Search.strict', () => {
  agent.__expectRoute('get_search', {
    'categories': [
      'alliance'
    ], 'search': 'query text', 'strict': true
  });
  let s = makeDefaultSearch(agent, esi.SearchCategory.ALLIANCE);
  return s.strict('query text').then(result => {
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBeTruthy();
  });
});

test('Search.get for character', () => {
  agent.__expectRoute('get_characters_character_id_search', {
    'character_id': 1, 'categories': [
      'constellation',
    ], 'search': 'query text', 'strict': false
  }, { token: 'token' });
  let s = makeCharacterSearch(agent, esi.character.SearchCategory.CONSTELLATION,
      1, 'token');
  return s('query text').then(result => {
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBeTruthy();
  });
});

test('Search.strict for character', () => {
  agent.__expectRoute('get_characters_character_id_search', {
    'character_id': 1, 'categories': [
      'structure'
    ], 'search': 'query text', 'strict': true
  }, { token: 'token' });
  let s = makeCharacterSearch(agent, esi.character.SearchCategory.STRUCTURE, 1,
      'token');
  return s.strict('query text').then(result => {
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBeTruthy();
  });
});