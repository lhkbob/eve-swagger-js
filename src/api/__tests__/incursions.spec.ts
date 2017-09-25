jest.mock('../../internal/esi-agent');

import { API, makeAPI } from '../../api';
import { ESIAgent } from '../../internal/esi-agent';

let api: API = makeAPI();
// Cast to any to get the private agent property
let agent: ESIAgent = (api as any).agent;

afterEach(() => {
  agent.__reset();
});

test('Incursions.all', () => {
  agent.__expectRoute('get_incursions', {});
  return api.incursions().then(result => {
    expect(result).toBeDefined();
  });
});
