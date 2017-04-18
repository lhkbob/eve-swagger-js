jest.mock('../../../internal/esi-agent');

const API = require('../../../api');

let api = new API();
let agent = api._esiAgent;

afterEach(() => {
  agent.__reset();
});

test('Colonies.layout', () => {
  agent.__expectRoute('get_characters_character_id_planets_planet_id', {
    'character_id': 1,
    'planet_id': 2
  }, { token: 'my_token' });
  return api.characters(1, 'my_token').colonies(2).then(result => {
    expect(result).toBeDefined();
  });
});

test('Colonies.layout', () => {
  agent.__expectRoute('get_characters_character_id_planets', {
    'character_id': 1
  }, { token: 'my_token' });
  return api.characters(1, 'my_token').colonies().then(result => {
    expect(result).toBeDefined();
  });
});
