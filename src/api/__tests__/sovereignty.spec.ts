jest.mock('../../internal/esi-agent');

import { API, makeAPI } from '../../index';
import { ESIAgent } from '../../internal/esi-agent';

let api: API = makeAPI();
// Cast to any to get the private agent property
let agent: ESIAgent = (api as any).agent;

afterEach(() => {
  agent.__reset();
});

test('Sovereignty.campaigns', () => {
  agent.__expectRoute('get_sovereignty_campaigns', {});
  return api.sovereignty.campaigns().then(result => {
    expect(result).toBeDefined();
  });
});

test('Sovereignty.structures', () => {
  agent.__expectRoute('get_sovereignty_structures', {});
  return api.sovereignty.structures().then(result => {
    expect(result).toBeDefined();
  });
});

test('Sovereignty.map', () => {
  agent.__expectRoute('get_sovereignty_map', {});
  return api.sovereignty.map().then(result => {
    expect(result).toBeDefined();
  });
});
