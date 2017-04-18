jest.mock('../../internal/esi-agent');

const API = require('../../api');

let api = new API();
let agent = api._esiAgent;

afterEach(() => {
  agent.__reset();
});

test('Sovereignty.campaigns', () => {
  agent.__expectRoute('get_sovereignty_campaigns', {});
  return api.sovereignty.campaigns().then(result => {
    expect(result).toBeDefined();
  });
});

test('Sovereignty.structures', () => {
  agent.__expectRoute('get_sovereignty_structures', {});
  return api.sovereignty.structures().then(result => {
    expect(result).toBeDefined();
  });
});
