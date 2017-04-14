jest.mock('../../../internal/ESIAgent');

const Api = require('../../../Api');

let api = new Api();
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
