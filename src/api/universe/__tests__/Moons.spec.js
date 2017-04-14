jest.mock('../../../internal/ESIAgent');

const Api = require('../../../Api');

let api = new Api();
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
