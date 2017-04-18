jest.mock('../../../internal/esi-agent');

const API = require('../../../api');

let api = new API();
let agent = api._esiAgent;

afterEach(() => {
  agent.__reset();
});

test('CharacterCorporation.info', () => {
  agent.__expectRoute('get_characters_character_id', {'character_id': 1});
  agent.__expectRoute('get_corporations_corporation_id', {'corporation_id': 109299958});
  return api.characters(1, 'my_token').corporation.info().then(result => {
    expect(result).toBeDefined();
  });
});

test('CharacterCorporation.history', () => {
  agent.__expectRoute('get_characters_character_id', {'character_id': 1});
  agent.__expectRoute('get_corporations_corporation_id_alliancehistory', {'corporation_id': 109299958});
  return api.characters(1, 'my_token').corporation.history().then(result => {
    expect(result).toBeDefined();
  });
});

test('CharacterCorporation.icon', () => {
  agent.__expectRoute('get_characters_character_id', {'character_id': 1});
  agent.__expectRoute('get_corporations_corporation_id_icons', {'corporation_id': 109299958});
  return api.characters(1, 'my_token').corporation.icon().then(result => {
    expect(result).toBeDefined();
  });
});

test('CharacterCorporation.loyaltyOffers', () => {
  agent.__expectRoute('get_characters_character_id', {'character_id': 1});
  agent.__expectRoute('get_loyalty_stores_corporation_id_offers', {'corporation_id': 109299958});
  return api.characters(1, 'my_token').corporation.loyaltyOffers().then(result => {
    expect(result).toBeDefined();
  });
});

test('CharacterCorporation.members', () => {
  agent.__expectRoute('get_characters_character_id', {'character_id': 1});
  agent.__expectRoute('get_corporations_corporation_id_members', {'corporation_id': 109299958}, {token: 'my_token'});
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
  agent.__expectRoute('get_characters_character_id', {'character_id': 1});
  agent.__expectRoute('get_corporations_corporation_id_roles', {'corporation_id': 109299958}, {token: 'my_token'});
  return api.characters(1, 'my_token').corporation.roles().then(result => {
    expect(result).toBeDefined();
  });
});

test('CharacterCorporation.id', () => {
  agent.__expectRoute('get_characters_character_id', {'character_id': 1});
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
  let charCorpMembers = Object.getOwnPropertyNames(Object.getPrototypeOf(charCorp));

  for (let e of corpMembers) {
    if (e == 'constructor') {
      continue; // skip this one
    }

    expect(charCorpMembers.includes(e)).toBeTruthy();
  }
});
