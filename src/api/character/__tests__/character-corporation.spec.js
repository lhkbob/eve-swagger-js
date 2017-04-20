jest.mock('../../../internal/esi-agent');

const API = require('../../../api');

let api = new API();
let agent = api._esiAgent;

function makeStructure(id) {
  return {
    'corporation_id': 667531913,
    'current_vul': [
      {
        'day': 1,
        'hour': 2
      }
    ],
    'next_vul': [
      {
        'day': 3,
        'hour': 4
      }
    ],
    'profile_id': 11237,
    'structure_id': id,
    'system_id': 30004763,
    'type_id': 35833,
    'fuel_expires': '',
    'services': [],
    'state_timer_start': '',
    'state_timer_end': '',
    'unanchors_at': ''
  };
}

function makeStructures(count) {
  let s = [];
  for (let i = 0; i < count; i++) {
    s.push(makeStructure(i));
  }
  return s;
}

afterEach(() => {
  agent.__reset();
});

test('CharacterCorporation.info', () => {
  agent.__expectRoute('get_characters_character_id', { 'character_id': 1 });
  agent.__expectRoute('get_corporations_corporation_id',
      { 'corporation_id': 109299958 });
  return api.characters(1, 'my_token').corporation.info().then(result => {
    expect(result).toBeDefined();
  });
});

test('CharacterCorporation.history', () => {
  agent.__expectRoute('get_characters_character_id', { 'character_id': 1 });
  agent.__expectRoute('get_corporations_corporation_id_alliancehistory',
      { 'corporation_id': 109299958 });
  return api.characters(1, 'my_token').corporation.history().then(result => {
    expect(result).toBeDefined();
  });
});

test('CharacterCorporation.icon', () => {
  agent.__expectRoute('get_characters_character_id', { 'character_id': 1 });
  agent.__expectRoute('get_corporations_corporation_id_icons',
      { 'corporation_id': 109299958 });
  return api.characters(1, 'my_token').corporation.icon().then(result => {
    expect(result).toBeDefined();
  });
});

test('CharacterCorporation.loyaltyOffers', () => {
  agent.__expectRoute('get_characters_character_id', { 'character_id': 1 });
  agent.__expectRoute('get_loyalty_stores_corporation_id_offers',
      { 'corporation_id': 109299958 });
  return api.characters(1, 'my_token').corporation.loyaltyOffers()
  .then(result => {
    expect(result).toBeDefined();
  });
});

test('CharacterCorporation.structures page', () => {
  agent.__expectRoute('get_characters_character_id', { 'character_id': 1 });
  agent.__expectRoute('get_corporations_corporation_id_structures', {
    'corporation_id': 109299958,
    'page': 1
  }, {token: 'my_token'});
  return api.characters(1, 'my_token').corporation.structures(1)
  .then(result => {
    expect(result).toBeDefined();
  });
});

test('CharacterCorporation.structures', () => {
  agent.__expectRoute('get_characters_character_id', { 'character_id': 1 });
  agent.__expectRoute('get_corporations_corporation_id_structures', {
    'corporation_id': 109299958,
    'page': 1
  }, { returns: makeStructures(250), token: 'my_token' });
  agent.__expectRoute('get_corporations_corporation_id_structures', {
    'corporation_id': 109299958,
    'page': 2
  }, { returns: makeStructures(250), token: 'my_token' });
  agent.__expectRoute('get_corporations_corporation_id_structures', {
    'corporation_id': 109299958,
    'page': 3
  }, { returns: makeStructures(5), token: 'my_token' });
  return api.characters(1, 'my_token').corporation.structures()
  .then(result => {
    expect(result.length).toEqual(505);
  });
});

test('CharacterCorporation.members', () => {
  agent.__expectRoute('get_characters_character_id', { 'character_id': 1 });
  agent.__expectRoute('get_corporations_corporation_id_members',
      { 'corporation_id': 109299958 }, { token: 'my_token' });
  return api.characters(1, 'my_token').corporation.members().then(result => {
    // Make sure the result is an array of integers
    expect(result.length).toBeGreaterThan(0);
    for (let e of result) {
      expect(e instanceof Number || (typeof e) == 'number').toBeTruthy();
      expect(Math.floor(e)).toEqual(e);
    }
    expect(result).toBeDefined();
  });
});

test('CharacterCorporation.roles', () => {
  agent.__expectRoute('get_characters_character_id', { 'character_id': 1 });
  agent.__expectRoute('get_corporations_corporation_id_roles',
      { 'corporation_id': 109299958 }, { token: 'my_token' });
  return api.characters(1, 'my_token').corporation.roles().then(result => {
    expect(result).toBeDefined();
  });
});

test('CharacterCorporation.id', () => {
  agent.__expectRoute('get_characters_character_id', { 'character_id': 1 });
  let char = api.characters(1, 'my_token');
  return char.corporation.id().then(result => {
    expect(result).toEqual(109299958);
    // Call id() a second time and confirm that the result is memo-ized,
    // i.e. it returns the same value but no more route invocation
    return char.corporation.id();
  }).then(result => {
    expect(result).toEqual(109299958);
  });
});

test('CharacterCorporation duck typing', () => {
  // Make sure CharacterCorporation has all of the public functions exposed
  // by the regular Corporation.
  let corp = api.corporations(1);
  let charCorp = api.characters(1, 'my_token').corporation;

  let corpMembers = Object.getOwnPropertyNames(Object.getPrototypeOf(corp));
  let charCorpMembers = Object.getOwnPropertyNames(
      Object.getPrototypeOf(charCorp));

  for (let e of corpMembers) {
    if (e == 'constructor') {
      continue; // skip this one
    }

    expect(charCorpMembers.includes(e)).toBeTruthy();
  }
});
