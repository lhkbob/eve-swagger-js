jest.mock('../../../internal/esi-agent');

import { API, makeAPI } from '../../../index';
import { ESIAgent } from '../../../internal/esi-agent';

let api: API = makeAPI();
// Cast to any to get the private agent property
let agent: ESIAgent = (api as any).agent;

afterEach(() => {
  agent.__reset();
});

test('Attribute.info', () => {
  agent.__expectRoute('get_dogma_attributes_attribute_id', {'attribute_id': 1});
  return api.dogma.attributes(1).info().then(result => {
    expect(result).toBeDefined();
  });
});

test('Attributes.all', () => {
  agent.__expectRoute('get_dogma_attributes', {});
  return api.dogma.attributes().then(result => {
    expect(result).toBeDefined();
  });
});

test('Effect.info', () => {
  agent.__expectRoute('get_dogma_effects_effect_id', {'effect_id': 1});
  return api.dogma.effects(1).info().then(result => {
    expect(result).toBeDefined();
  });
});

test('Effects.all', () => {
  agent.__expectRoute('get_dogma_effects', {});
  return api.dogma.effects().then(result => {
    expect(result).toBeDefined();
  });
});
