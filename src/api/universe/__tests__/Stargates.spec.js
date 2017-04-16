jest.mock('../../../internal/ESIAgent');

const Api = require('../../../Api');

let api = new Api();
let agent = api._esiAgent;

afterEach(() => {
  agent.__reset();
});

test('Stargate.info', () => {
  agent.__expectRoute('get_universe_stargates_stargate_id', { 'stargate_id': 1 });
  return api.stargates(1).info().then(result => {
    expect(result).toBeDefined();
  });
});
