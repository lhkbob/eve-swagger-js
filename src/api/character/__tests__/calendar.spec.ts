jest.mock('../../../internal/esi-agent');

import { API, makeAPI } from '../../../index';
import { ESIAgent } from '../../../internal/esi-agent';

let api: API = makeAPI();
// Cast to any to get the private agent property
let agent: ESIAgent = (api as any).agent;

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
  return api.characters(1, 'my_token').calendar(2).respond('declined').then(result => {
    expect(result).not.toBeDefined();
  });
});

test('Event.accept', () => {
  agent.__expectRoute('put_characters_character_id_calendar_event_id', {
    'character_id': 1,
    'event_id': 2,
    'response': { 'response': 'accepted' }
  }, { token: 'my_token' });
  return api.characters(1, 'my_token').calendar(2).respond('accepted').then(result => {
    expect(result).not.toBeDefined();
  });
});

test('Event.tentative', () => {
  agent.__expectRoute('put_characters_character_id_calendar_event_id', {
    'character_id': 1,
    'event_id': 2,
    'response': { 'response': 'tentative' }
  }, { token: 'my_token' });
  return api.characters(1, 'my_token').calendar(2).respond('tentative').then(result => {
    expect(result).not.toBeDefined();
  });
});

test('Calendar.recent', () => {
  agent.__expectRoute('get_characters_character_id_calendar', {
    'character_id': 1,
    'from_event': undefined
  }, {token: 'my_token'});
  return api.characters(1, 'my_token').calendar().then(result => {
    expect(result).toBeDefined();
  });
});

test('Calendar.recent from_event_id', () => {
  agent.__expectRoute('get_characters_character_id_calendar', {
    'character_id': 1,
    'from_event': 2
  }, {token: 'my_token'});
  return api.characters(1, 'my_token').calendar.history(2).then(result => {
    expect(result).toBeDefined();
  });
});
