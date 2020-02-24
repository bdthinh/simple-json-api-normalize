const jsonApiNormalize = require('./index');

describe('jsonApiNormalize', () => {
  it('should deserialize response with jsonapi spec', () => {
    const response = {
      data: {
        id: '55',
        type: 'tasks',
        attributes: {
          subject: 'Re: [To: ["max+redis_01@saleswhale.com"]]Hi Max Redis',
          body:
            "Sender Max Lorenz <max@saleswhale.com>\r\nTo: max+redis_01@saleswhale.com, Chocolate Sim <chocolate.sim@saleswhale.com>\r\n\r\nYes, I am interested\r\n\r\nMax\r\nOn 8 Jan 2020, 4:34 PM +0800, Chocolate Sim <chocolate.sim@saleswhale.com>, wrote:\r\n> Hi Max Redis ,\r\n>\r\n> My colleague reached out to you a few months ago.\r\n>\r\n> I am reconnecting to see if you are keen to find out how we've helped companies similar to yours qualify marketing leads and book sales conversations at scale.\r\n>\r\n> Will you be free for a call sometime this or next week?\r\n",
        },
      },
      jsonapi: {
        version: '1.0',
      },
    };
    expect(jsonApiNormalize(response)).toEqual({
      id: '55',
      type: 'tasks',
      subject: 'Re: [To: ["max+redis_01@saleswhale.com"]]Hi Max Redis',
      body:
        "Sender Max Lorenz <max@saleswhale.com>\r\nTo: max+redis_01@saleswhale.com, Chocolate Sim <chocolate.sim@saleswhale.com>\r\n\r\nYes, I am interested\r\n\r\nMax\r\nOn 8 Jan 2020, 4:34 PM +0800, Chocolate Sim <chocolate.sim@saleswhale.com>, wrote:\r\n> Hi Max Redis ,\r\n>\r\n> My colleague reached out to you a few months ago.\r\n>\r\n> I am reconnecting to see if you are keen to find out how we've helped companies similar to yours qualify marketing leads and book sales conversations at scale.\r\n>\r\n> Will you be free for a call sometime this or next week?\r\n",
      meta: {},
    });
  });

  it('should not deserialize response without jsonapi spec', () => {
    const response = {
      id: 1848,
      subject: 'Re: Hi Stephane, reaching out from Seamless Philippines',
      body: 'reply',
    };
    expect(jsonApiNormalize(response)).toEqual({
      id: 1848,
      subject: 'Re: Hi Stephane, reaching out from Seamless Philippines',
      body: 'reply',
    });
  });
});
