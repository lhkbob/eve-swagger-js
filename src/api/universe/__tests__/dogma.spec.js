jest.mock('../../../internal/esi-agent');

const API = require('../../../api');

let api = new API();
let agent = api._esiAgent;

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
