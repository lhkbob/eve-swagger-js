jest.mock('../../internal/ESIAgent');

const Api = require('../../../Api');

let api = new Api();
let agent = api._esiAgent;

test('Bloodlines.all', () => {
  agent.__expectRoute('get_universe_bloodlines', {});
  return api.bloodlines().then(result => {
    expect(result).toBeDefined();
  });
});
