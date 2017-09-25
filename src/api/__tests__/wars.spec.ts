jest.mock('../../internal/esi-agent');

import { API, makeAPI } from '../../api';
import { ESIAgent } from '../../internal/esi-agent';

let api: API = makeAPI();
// Cast to any to get the private agent property
let agent: ESIAgent = (api as any).agent;

function createKillIDs(count) {
  let mails = [];
  for (let i = 0; i < count; i++) {
    mails.push({
      'killmail_id': i,
      'killmail_hash': 'hash' + i
    });
  }
  return mails;
}

function expectKills(warId, mails) {
  for (let offset = 0; offset < mails.length; offset += 2000) {
    let end = offset + 2000;
    if (mails.length < end) {
      end = mails.length;
    }

    let page = Math.floor(offset / 2000) + 1;
    let result = mails.slice(offset, end);
    agent.__expectRoute('get_wars_war_id_killmails', {
      'war_id': warId,
      'page': page
    }, { returns: result });


    for (let i = 0; i < result.length; i++) {
      agent.__expectRoute('get_killmails_killmail_id_killmail_hash', {
        'killmail_id': result[i].killmail_id,
        'killmail_hash': result[i].killmail_hash
      });
    }
  }
}

function expectMails(warId, mails) {
  for (let offset = 0; offset < mails.length; offset += 2000) {
    let end = offset + 2000;
    if (mails.length < end) {
      end = mails.length;
    }

    let page = Math.floor(offset / 2000) + 1;
    let result = mails.slice(offset, end);
    agent.__expectRoute('get_wars_war_id_killmails', {
      'war_id': warId,
      'page': page
    }, { returns: result });
  }
}

afterEach(() => {
  agent.__reset();
});

test('War.info', () => {
  agent.__expectRoute('get_wars_war_id', { 'war_id': 1 });
  return api.wars(1).info().then(result => {
    expect(result).toBeDefined();
  });
});

test('War.kills page', () => {
  expectKills(1, createKillIDs(2));
  return api.wars(1).kills(1).then(result => {
    expect(result.length).toEqual(2);
  });
});

test('War.kills all', () => {
  expectKills(1, createKillIDs(4003));
  return api.wars(1).kills().then(result => {
    expect(result.length).toEqual(4003);
  });
});

test('War.killmails page', () => {
  expectMails(1, createKillIDs(2));
  return api.wars(1).killmails(1).then(result => {
    expect(result.length).toEqual(2);
  });
});

test('War.killmails all', () => {
  expectMails(1, createKillIDs(4003));
  return api.wars(1).killmails().then(result => {
    expect(result.length).toEqual(4003);
  });
});

test('Wars.recent', () => {
  agent.__expectRoute('get_wars', { 'max_war_id': undefined });
  return api.wars.recent().then(result => {
    expect(result).toBeDefined();
  });
});

test('Wars.recent maxWarId', () => {
  agent.__expectRoute('get_wars', { 'max_war_id': 5 });
  return api.wars.recent(5).then(result => {
    expect(result).toBeDefined();
  });
});
