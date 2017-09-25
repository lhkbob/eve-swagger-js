jest.mock('../../../internal/esi-agent');

import { API, makeAPI } from '../../../api';
import { ESIAgent } from '../../../internal/esi-agent';

let api: API = makeAPI();
// Cast to any to get the private agent property
let agent: ESIAgent = (api as any).agent;

afterEach(() => {
  agent.__reset();
});

test('Moon.info', () => {
  agent.__expectRoute('get_universe_moons_moon_id', { 'moon_id': 1 });
  return api.moons(1).info().then(result => {
    expect(result).toBeDefined();
  });
});
