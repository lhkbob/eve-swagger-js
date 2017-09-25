jest.mock('../../../internal/esi-agent');

import { API, makeAPI } from '../../../api';
import { ESIAgent } from '../../../internal/esi-agent';

let api: API = makeAPI();
// Cast to any to get the private agent property
let agent: ESIAgent = (api as any).agent;

afterEach(() => {
  agent.__reset();
});

test('PlanetaryInteraction.schematic', () => {
  agent.__expectRoute('get_universe_schematics_schematic_id', { 'schematic_id': 1 });
  return api.pi(1).then(result => {
    expect(result).toBeDefined();
  });
});
