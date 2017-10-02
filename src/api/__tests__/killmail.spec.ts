jest.mock('../../internal/esi-agent');

import { API, makeAPI } from '../../index';
import { ESIAgent } from '../../internal/esi-agent';

let api: API = makeAPI();
// Cast to any to get the private agent property
let agent: ESIAgent = (api as any).agent;

afterEach(() => {
  agent.__reset();
});

test('Killmail.get', () => {
  agent.__expectRoute('get_killmails_killmail_id_killmail_hash', {
    'killmail_id': 1,
    'killmail_hash': 'hash'
  });
  return api.killmail(1, 'hash').then(result => {
    expect(result).toBeDefined();
  });
});
