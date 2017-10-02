jest.mock('../../../internal/esi-agent');

import { API, makeAPI } from '../../../index';
import { ESIAgent } from '../../../internal/esi-agent';

let api: API = makeAPI();
// Cast to any to get the private agent property
let agent: ESIAgent = (api as any).agent;

afterEach(() => {
  agent.__reset();
});

test('Stargate.info', () => {
  agent.__expectRoute('get_universe_stargates_stargate_id', { 'stargate_id': 1 });
  return api.stargates(1).info().then(result => {
    expect(result).toBeDefined();
  });
});
