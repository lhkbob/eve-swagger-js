jest.mock('../../../internal/esi-agent');

import { API, makeAPI } from '../../../index';
import { ESIAgent } from '../../../internal/esi-agent';

let api: API = makeAPI();
// Cast to any to get the private agent property
let agent: ESIAgent = (api as any).agent;

afterEach(() => {
  agent.__reset();
});

test('Colonies.layout', () => {
  agent.__expectRoute('get_characters_character_id_planets_planet_id', {
    'character_id': 1, 'planet_id': 2
  }, { token: 'my_token' });
  return api.characters(1, 'my_token').colonies(2).layout().then(result => {
    expect(result).toBeDefined();
  });
});

test('Colonies.all', () => {
  agent.__expectRoute('get_characters_character_id_planets', {
    'character_id': 1
  }, { token: 'my_token' });
  return api.characters(1, 'my_token').colonies().then(result => {
    expect(result).toBeDefined();
  });
});
