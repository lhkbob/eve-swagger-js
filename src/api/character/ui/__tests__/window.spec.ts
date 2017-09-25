jest.mock('../../../../internal/esi-agent');

import { API, makeAPI } from '../../../../api';
import { ESIAgent } from '../../../../internal/esi-agent';

let api: API = makeAPI();
// Cast to any to get the private agent property
let agent: ESIAgent = (api as any).agent;

afterEach(() => {
  agent.__reset();
});

test('Window.info', () => {
  agent.__expectRoute('post_ui_openwindow_information', {
    'target_id': 2
  }, { 'token': 'my_token' });
  return api.characters(1, 'my_token').window.info(2).then(result => {
    expect(result).not.toBeDefined();
  });
});

test('Window.market', () => {
  agent.__expectRoute('post_ui_openwindow_marketdetails', {
    'type_id': 2
  }, { 'token': 'my_token' });
  return api.characters(1, 'my_token').window.market(2).then(result => {
    expect(result).not.toBeDefined();
  });
});

test('Window.contract', () => {
  agent.__expectRoute('post_ui_openwindow_contract', {
    'contract_id': 2
  }, { 'token': 'my_token' });
  return api.characters(1, 'my_token').window.contract(2).then(result => {
    expect(result).not.toBeDefined();
  });
});

test('Window.newMail', () => {
  agent.__expectRoute('post_ui_openwindow_newmail', {
    'new_mail': {
      'subject': 'SUBJECT',
      'recipients': [1, 2],
      'body': 'this is the body text.',
      'to_corp_or_alliance_id': 0,
      'to_mailing_list_id': 0
    }
  }, { 'token': 'my_token' });
  return api.characters(1, 'my_token').window.newMail({
    'subject': 'SUBJECT',
    'recipients': [1, 2],
    'body': 'this is the body text.',
    'to_corp_or_alliance_id': 0,
    'to_mailing_list_id': 0
  }).then(result => {
    expect(result).not.toBeDefined();
  });
});