jest.mock('../../../internal/ESIAgent');

const Api = require('../../../Api');

let api = new Api();
let agent = api._esiAgent;

afterEach(() => {
  agent.__reset();
});

test('PlanetaryInteraction.schematic', () => {
  agent.__expectRoute('get_universe_schematics_schematic_id', { 'schematic_id': 1 });
  return api.pi.schematic(1).then(result => {
    expect(result).toBeDefined();
  });
});
