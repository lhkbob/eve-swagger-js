jest.mock('../../../internal/ESIAgent');

const Api = require('../../../Api');

let api = new Api();
let agent = api._esiAgent;

afterEach(() => {
  agent.__reset();
});

test('Event.info', () => {
  agent.__expectRoute('get_characters_character_id_calendar_event_id', {
    'character_id': 1,
    'event_id': 2
  }, { token: 'my_token' });
  return api.characters(1, 'my_token').calendar(2).info().then(result => {
    expect(result).toBeDefined();
  });
});

test('Event.decline', () => {
  agent.__expectRoute('put_characters_character_id_calendar_event_id', {
    'character_id': 1,
    'event_id': 2,
    'response': { 'response': 'declined' }
  }, { token: 'my_token' });
  return api.characters(1, 'my_token').calendar(2).decline().then(result => {
    expect(result).toBeDefined();
  });
});

test('Event.accept', () => {
  agent.__expectRoute('put_characters_character_id_calendar_event_id', {
    'character_id': 1,
    'event_id': 2,
    'response': { 'response': 'accepted' }
  }, { token: 'my_token' });
  return api.characters(1, 'my_token').calendar(2).accept().then(result => {
    expect(result).toBeDefined();
  });
});

test('Event.tentative', () => {
  agent.__expectRoute('put_characters_character_id_calendar_event_id', {
    'character_id': 1,
    'event_id': 2,
    'response': { 'response': 'tentative' }
  }, { token: 'my_token' });
  return api.characters(1, 'my_token').calendar(2).tentative().then(result => {
    expect(result).toBeDefined();
  });
});

test('Calendar.recent', () => {
  agent.__expectRoute('get_characters_character_id_calendar', {
    'character_id': 1,
    'from_event': null
  }, {token: 'my_token'});
  return api.characters(1, 'my_token').calendar.recent().then(result => {
    expect(result).toBeDefined();
  });
});

test('Calendar.recent from_event_id', () => {
  agent.__expectRoute('get_characters_character_id_calendar', {
    'character_id': 1,
    'from_event': 2
  }, {token: 'my_token'});
  return api.characters(1, 'my_token').calendar.recent(2).then(result => {
    expect(result).toBeDefined();
  });
});
