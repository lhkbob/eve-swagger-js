jest.mock('../../internal/ESIAgent');

const Api = require('../../Api');

let api = new Api();
let agent = api._esiAgent;

afterEach(() => {
  agent.__reset();
});

test('Killmail.get', () => {
  agent.__expectRoute('get_killmails_killmail_id_killmail_hash', {'killmail_id': 1, 'killmail_hash': 'hash'});
  return api.killmail(1, 'hash').then(result => {
    expect(result).toBeDefined();
  });
});
