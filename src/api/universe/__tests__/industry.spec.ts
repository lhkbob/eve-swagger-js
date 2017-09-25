jest.mock('../../../internal/esi-agent');

import { API, makeAPI } from '../../../api';
import { ESIAgent } from '../../../internal/esi-agent';

let api: API = makeAPI();
// Cast to any to get the private agent property
let agent: ESIAgent = (api as any).agent;

afterEach(() => {
  agent.__reset();
});

test('Industry.facilities', () => {
  agent.__expectRoute('get_industry_facilities', { });
  return api.industry.facilities().then(result => {
    expect(result).toBeDefined();
  });
});

test('Industry.systems', () => {
  agent.__expectRoute('get_industry_systems', { });
  return api.industry.systemCosts().then(result => {
    expect(result).toBeDefined();
  });
});
