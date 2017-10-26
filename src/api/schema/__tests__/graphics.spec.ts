jest.mock('../../../internal/esi-agent');

import { API, makeAPI } from '../../../index';
import { ESIAgent } from '../../../internal/esi-agent';

let api: API = makeAPI();
// Cast to any to get the private agent property
let agent: ESIAgent = (api as any).agent;

afterEach(() => {
  agent.__reset();
});

test('Graphic.info', () => {
  agent.__expectRoute('get_universe_graphics_graphic_id', { 'graphic_id': 1 });
  return api.graphics(1).info().then(result => {
    expect(result).toBeDefined();
  });
});

test('Graphics.all', () => {
  agent.__expectRoute('get_universe_graphics', {});
  return api.graphics().then(result => {
    expect(result).toBeDefined();
  });
});
