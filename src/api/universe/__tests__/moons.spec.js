jest.mock('../../../internal/esi-agent');

const API = require('../../../api');

let api = new API();
let agent = api._esiAgent;

afterEach(() => {
  agent.__reset();
});

test('Moon.info', () => {
  agent.__expectRoute('get_universe_moons_moon_id', { 'moon_id': 1 });
  return api.moons(1).info().then(result => {
    expect(result).toBeDefined();
  });
});
