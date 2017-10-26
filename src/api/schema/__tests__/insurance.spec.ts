jest.mock('../../../internal/esi-agent');

import { API, makeAPI } from '../../../index';
import { ESIAgent } from '../../../internal/esi-agent';

let api: API = makeAPI();
// Cast to any to get the private agent property
let agent: ESIAgent = (api as any).agent;

afterEach(() => {
  agent.__reset();
});

test('Insurance.prices', () => {
  agent.__expectRoute('get_insurance_prices', { });
  return api.insurance.prices().then(result => {
    expect(result).toBeDefined();
  });
});
