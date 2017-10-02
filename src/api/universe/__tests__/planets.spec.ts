jest.mock('../../../internal/esi-agent');

import { API, makeAPI } from '../../../index';
import { ESIAgent } from '../../../internal/esi-agent';

let api: API = makeAPI();
// Cast to any to get the private agent property
let agent: ESIAgent = (api as any).agent;

afterEach(() => {
  agent.__reset();
});

test('Planet.info', () => {
  agent.__expectRoute('get_universe_planets_planet_id', { 'planet_id': 1 });
  return api.planets(1).info().then(result => {
    expect(result).toBeDefined();
  });
});
