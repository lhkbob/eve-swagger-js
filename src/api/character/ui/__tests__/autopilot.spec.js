jest.mock('../../../../internal/esi-agent');

const API = require('../../../../api');

let api = new API();
let agent = api._esiAgent;

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
    expect(result).toBeDefined();
  });
});

test('Autopilot.append', () => {
  agent.__expectRoute('post_ui_autopilot_waypoint', {
    'destination_id': 2,
    'clear_other_waypoints': false,
    'add_to_beginning': false
  }, { 'token': 'my_token' });
  return api.characters(1, 'my_token').autopilot.append(2).then(result => {
    expect(result).toBeDefined();
  });
});

test('Autopilot.prepend', () => {
  agent.__expectRoute('post_ui_autopilot_waypoint', {
    'destination_id': 2,
    'clear_other_waypoints': false,
    'add_to_beginning': true
  }, { 'token': 'my_token' });
  return api.characters(1, 'my_token').autopilot.prepend(2).then(result => {
    expect(result).toBeDefined();
  });
});