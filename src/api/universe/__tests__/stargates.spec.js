jest.mock('../../../internal/esi-agent');

const API = require('../../../api');

let api = new API();
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
