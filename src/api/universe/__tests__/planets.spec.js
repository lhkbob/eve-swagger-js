jest.mock('../../../internal/esi-agent');

const API = require('../../../api');

let api = new API();
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
