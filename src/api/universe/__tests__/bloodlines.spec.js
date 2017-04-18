jest.mock('../../../internal/esi-agent');

const API = require('../../../api');

let api = new API();
let agent = api._esiAgent;

afterEach(() => {
  agent.__reset();
});

test('Bloodlines.all', () => {
  agent.__expectRoute('get_universe_bloodlines', {});
  return api.bloodlines().then(result => {
    expect(result).toBeDefined();
  });
});
