jest.mock('../../../internal/esi-agent');

const API = require('../../../api');

let api = new API();
let agent = api._esiAgent;

function createMailHeaders(count) {
  let mails = [];
  for (let i = 0; i < count; i++) {
    mails.push({
      "from": 90000001,
      "is_read": true,
      "labels": [
        3
      ],
      "recipients": [
        {
          "recipient_id": 90000002,
          "recipient_type": "character"
        }
      ],
      "subject": "Title for EVE Mail",
      "timestamp": "2015-09-30T16:07:00Z",
      'mail_id': i,
    });
  }
  return mails;
}

function expectMailsSinglePage(charId, lastMailId, token, mails) {
  agent.__expectRoute('get_characters_character_id_mail', {
    'character_id': charId,
    'labels': null,
    'last_mail_id': lastMailId,
  }, {
    returns: mails,
    token: token
  });
}

function expectMails(charId, token, mails) {
  let lastMailId = null;
  for (let offset = 0; offset < mails.length; offset += 50) {
    let end = offset + 50;
    if (mails.length < end) {
      end = mails.length;
    }

    let pageMails = mails.slice(offset, end);
    expectMailsSinglePage(charId, lastMailId, token, pageMails);
    lastMailId = pageMails[pageMails.length - 1].mail_id;
  }
}

afterEach(() => {
  agent.__reset();
});

test('Message.info', () => {
  agent.__expectRoute('get_characters_character_id_mail_mail_id', {
    'character_id': 1,
    'mail_id': 2
  }, { token: 'my token' });
  return api.characters(1, 'my token').mail(2).info().then(result => {
    expect(result).toBeDefined();
  });
});

test('Message.del', () => {
  agent.__expectRoute('delete_characters_character_id_mail_mail_id', {
    'character_id': 1,
    'mail_id': 2
  }, { token: 'my token' });
  return api.characters(1, 'my token').mail(2).del().then(result => {
    expect(result).toBeDefined();
  });
});

test('Message.update', () => {
  agent.__expectRoute('put_characters_character_id_mail_mail_id', {
    'character_id': 1,
    'mail_id': 2,
    'contents': {
      'labels': [4, 5],
      'read': true
    }
  }, { token: 'my token' });
  return api.characters(1, 'my token').mail(2).update({
    labels: [4, 5],
    read: true
  })
  .then(result => {
    expect(result).toBeDefined();
  });
});

test('Label.del', () => {
  agent.__expectRoute('delete_characters_character_id_mail_labels_label_id', {
    'character_id': 1,
    'label_id': 2
  }, { token: 'my token' });
  return api.characters(1, 'my token').mail.labels(2).del().then(result => {
    expect(result).toBeDefined();
  });
});

test('Labels.all', () => {
  agent.__expectRoute('get_characters_character_id_mail_labels', {
    'character_id': 1,
  }, { token: 'my token' });
  return api.characters(1, 'my token').mail.labels().then(result => {
    expect(Array.isArray(result)).toBeTruthy();
    expect(result['total_unread_count']).toBeUndefined();
  });
});

test('Labels.add', () => {
  agent.__expectRoute('post_characters_character_id_mail_labels', {
    'character_id': 1,
    'label': {
      'name': 'new label',
      'color': '#660066'
    }
  }, { token: 'my token' });
  return api.characters(1, 'my token').mail.labels.add({
    name: 'new label',
    color: '#660066'
  }).then(result => {
    expect(result).toBeDefined();
  });
});

test('Mail.unreadCount', () => {
  agent.__expectRoute('get_characters_character_id_mail_labels', {
    'character_id': 1
  }, { token: 'my token' });
  return api.characters(1, 'my token').mail.unreadCount().then(result => {
    expect(result instanceof Number || (typeof result) == 'number')
    .toBeTruthy();
    expect(Math.floor(result)).toEqual(result);
  });
});

test('Mail.cspaCost', () => {
  agent.__expectRoute('post_characters_character_id_cspa', {
    'character_id': 1,
    'characters': { 'characters': [2, 3, 4] }
  }, { token: 'my token' });
  return api.characters(1, 'my token').mail.cspaCost([2, 3, 4]).then(result => {
    expect(result instanceof Number || (typeof result) == 'number')
    .toBeTruthy();
  });
});

test('Mail.inbox', () => {
  agent.__expectRoute('get_characters_character_id_mail', {
    'character_id': 1,
    'labels': null,
    'last_mail_id': null
  }, { token: 'my token' });
  return api.characters(1, 'my token').mail().then(result => {
    expect(result).toBeDefined();
  });
});

test('Mail.inbox non-default', () => {
  agent.__expectRoute('get_characters_character_id_mail', {
    'character_id': 1,
    'labels': [2, 3],
    'last_mail_id': 4
  }, { token: 'my token' });
  return api.characters(1, 'my token').mail.inbox([2, 3], 4).then(result => {
    expect(result).toBeDefined();
  });
});

test('Mail.all', () => {
  expectMails(1, 'my token', createMailHeaders(153));
  return api.characters(1, 'my token').mail.all().then(result => {
    expect(result.length).toEqual(153);
  });
});

test('Mail.send', () => {
  let mail = {
    'approved_cost': 0,
    'body': 'message text',
    'recipients': [
      {
        'recipient_type': 'character',
        'recipient_id': 4
      }
    ],
    'subject': 'message subject'
  };
  agent.__expectRoute('post_characters_character_id_mail', {
    'character_id': 1,
    'mail': mail
  }, { token: 'my token' });
  return api.characters(1, 'my token').mail.send(mail).then(result => {
    expect(result).toBeDefined();
  });
});

test('Mail.lists', () => {
  agent.__expectRoute('get_characters_character_id_mail_lists',
      { 'character_id': 1 }, { token: 'my token' });
  return api.characters(1, 'my token').mail.lists().then(result => {
    expect(result).toBeDefined();
  });
});
