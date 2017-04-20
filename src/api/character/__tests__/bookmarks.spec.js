jest.mock('../../../internal/esi-agent');

const API = require('../../../api');

let api = new API();
let agent = api._esiAgent;

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
