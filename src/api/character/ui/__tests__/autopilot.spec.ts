jest.mock('../../../../internal/esi-agent');

import { API, makeAPI } from '../../../../api';
import { ESIAgent } from '../../../../internal/esi-agent';

let api: API = makeAPI();
// Cast to any to get the private agent property
let agent: ESIAgent = (api as any).agent;

afterEach(() => {
  agent.__reset();
});

test('Autopilot.destination', () => {
  agent.__expectRoute('post_ui_autopilot_waypoint', {
    'destination_id': 2,
    'clear_other_waypoints': true,
    'add_to_beginning': true
  }, { 'token': 'my_token' });
  return api.characters(1, 'my_token').autopilot.destination(2).then(result => {
    expect(result).not.toBeDefined();
  });
});

test('Autopilot.append', () => {
  agent.__expectRoute('post_ui_autopilot_waypoint', {
    'destination_id': 2,
    'clear_other_waypoints': false,
    'add_to_beginning': false
  }, { 'token': 'my_token' });
  return api.characters(1, 'my_token').autopilot.append(2).then(result => {
    expect(result).not.toBeDefined();
  });
});

test('Autopilot.prepend', () => {
  agent.__expectRoute('post_ui_autopilot_waypoint', {
    'destination_id': 2,
    'clear_other_waypoints': false,
    'add_to_beginning': true
  }, { 'token': 'my_token' });
  return api.characters(1, 'my_token').autopilot.prepend(2).then(result => {
    expect(result).not.toBeDefined();
  });
});