jest.mock('../../../internal/ESIAgent');

const Api = require('../../../Api');

let api = new Api();
let agent = api._esiAgent;

afterEach(() => {
  agent.__reset();
});

test('Planet.info', () => {
  agent.__expectRoute('get_universe_planets_planet_id', { 'planet_id': 1 });
  return api.planets(1).info().then(result => {
    expect(result).toBeDefined();
  });
});
