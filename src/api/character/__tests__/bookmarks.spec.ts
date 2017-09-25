jest.mock('../../../internal/esi-agent');

import { API, makeAPI } from '../../../api';
import { ESIAgent } from '../../../internal/esi-agent';

let api: API = makeAPI();
// Cast to any to get the private agent property
let agent: ESIAgent = (api as any).agent;

afterEach(() => {
  agent.__reset();
});

test('Bookmarks.folders', () => {
  agent.__expectRoute('get_characters_character_id_bookmarks_folders',
      {'character_id': 1}, {token: 'my_token'});
  return api.characters(1, 'my_token').bookmarks.folders().then(result => {
    expect(result).toBeDefined();
  });
});

test('Bookmarks.all', () => {
  agent.__expectRoute('get_characters_character_id_bookmarks',
      {'character_id': 1}, {token: 'my_token'});
  return api.characters(1, 'my_token').bookmarks().then(result => {
    expect(result).toBeDefined();
  });
});
