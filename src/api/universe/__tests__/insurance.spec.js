jest.mock('../../../internal/esi-agent');

const API = require('../../../api');

let api = new API();
let agent = api._esiAgent;

afterEach(() => {
  agent.__reset();
});

test('Insurance.prices', () => {
  agent.__expectRoute('get_insurance_prices', { });
  return api.insurance.prices().then(result => {
    expect(result).toBeDefined();
  });
});
