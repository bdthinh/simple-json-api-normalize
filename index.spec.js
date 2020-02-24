const normalize = require('./index');

describe('normalize', () => {
  it('should not normalize response without jsonapi spec', () => {
    const response = {
      id: 1848,
      subject: 'Re: Hi Stephane, reaching out from Seamless Philippines',
      body: 'reply',
    };
    expect(normalize(response)).toEqual({
      id: 1848,
      subject: 'Re: Hi Stephane, reaching out from Seamless Philippines',
      body: 'reply',
    });
  });

  it('should normalize correctly even without attributes', () => {
    const response = {
      data: {
        id: '55',
        type: 'task',
      },
      jsonapi: { version: '1.0' },
    };

    expect(normalize(response)).toEqual({
      id: '55',
      type: 'task',
      meta: {},
    });
  });

  it('should normalize response with attributes', () => {
    const response = {
      data: {
        id: '55',
        type: 'task',
        attributes: {
          subject: 'Re: [To: ["max+redis_01@saleswhale.com"]]Hi Max Redis',
          body: 'Will you be free for a call sometime this or next week',
        },
      },
      jsonapi: { version: '1.0' },
    };
    expect(normalize(response)).toEqual({
      id: '55',
      type: 'task',
      subject: 'Re: [To: ["max+redis_01@saleswhale.com"]]Hi Max Redis',
      body: 'Will you be free for a call sometime this or next week',
      meta: {},
    });
  });

  it('should normalize with included', () => {
    const response = {
      data: {
        id: '55',
        type: 'task',
        attributes: {
          subject: 'Re: [To: ["max+redis_01@saleswhale.com"]]Hi Max Redis',
          body: 'Will you be free for a call sometime this or next week',
        },
        relationships: {
          campaign: {
            data: {
              id: '12',
              type: 'campaign',
            },
          },
        },
      },
      included: [{ id: '12', type: 'campaign', attributes: { name: 'test campaign' } }],
      jsonapi: { version: '1.0' },
    };

    expect(normalize(response)).toEqual({
      id: '55',
      type: 'task',
      subject: 'Re: [To: ["max+redis_01@saleswhale.com"]]Hi Max Redis',
      body: 'Will you be free for a call sometime this or next week',
      campaign: {
        id: '12',
        type: 'campaign',
        name: 'test campaign',
      },
      meta: {},
    });
  });

  it('should normalize even without included', () => {
    const response = {
      data: {
        id: '55',
        type: 'task',
        attributes: {
          subject: 'Re: [To: ["max+redis_01@saleswhale.com"]]Hi Max Redis',
          body: 'Will you be free for a call sometime this or next week',
        },
        relationships: {
          campaign: {
            data: {
              id: '12',
              type: 'campaign',
            },
          },
        },
      },
      jsonapi: { version: '1.0' },
    };

    expect(normalize(response)).toEqual({
      id: '55',
      type: 'task',
      subject: 'Re: [To: ["max+redis_01@saleswhale.com"]]Hi Max Redis',
      body: 'Will you be free for a call sometime this or next week',
      campaign: {
        id: undefined,
        type: undefined,
      },
      meta: {},
    });
  });

  it('should normalize with meta', () => {
    const response = {
      data: {
        id: '55',
        type: 'task',
        attributes: {
          subject: 'Re: [To: ["max+redis_01@saleswhale.com"]]Hi Max Redis',
          body: 'Will you be free for a call sometime this or next week',
        },
      },
      meta: { currentPage: 1 },
      jsonapi: { version: '1.0' },
    };

    expect(normalize(response)).toEqual({
      id: '55',
      type: 'task',
      subject: 'Re: [To: ["max+redis_01@saleswhale.com"]]Hi Max Redis',
      body: 'Will you be free for a call sometime this or next week',
      meta: { currentPage: 1 },
    });
  });

  it('should normalize array of data', () => {
    const response = {
      data: [
        {
          id: '55',
          type: 'task',
          attributes: {
            subject: 'mysubject',
            body: 'mybody',
          },
        },
        {
          id: '56',
          type: 'task',
          attributes: {
            subject: 'mysubject',
            body: 'mybody',
          },
        },
      ],
      meta: { currentPage: 1 },
      jsonapi: { version: '1.0' },
    };

    expect(normalize(response)).toEqual([
      {
        id: '55',
        type: 'task',
        subject: 'mysubject',
        body: 'mybody',
        meta: { currentPage: 1 },
      },
      {
        id: '56',
        type: 'task',
        subject: 'mysubject',
        body: 'mybody',
        meta: { currentPage: 1 },
      },
    ]);
  });

  it('should normalize with multiple level relationships', () => {
    const response = {
      data: {
        id: '55',
        type: 'task',
        attributes: {
          subject: 'Re: [To: ["max+redis_01@saleswhale.com"]]Hi Max Redis',
          body: 'Will you be free for a call sometime this or next week',
        },
        relationships: {
          campaign: {
            data: {
              id: '12',
              type: 'campaign',
            },
          },
        },
      },
      included: [
        {
          id: '12',
          type: 'campaign',
          attributes: { name: 'test campaign', description: 'this is a test campaign' },
          relationships: {
            topic: {
              data: {
                id: '42',
                type: 'topic',
              },
            },
          },
        },
        { id: '42', type: 'topic', attributes: { name: 'test topic' } },
      ],
      jsonapi: { version: '1.0' },
    };

    expect(normalize(response)).toEqual({
      id: '55',
      type: 'task',
      subject: 'Re: [To: ["max+redis_01@saleswhale.com"]]Hi Max Redis',
      body: 'Will you be free for a call sometime this or next week',
      campaign: {
        id: '12',
        type: 'campaign',
        name: 'test campaign',
        description: 'this is a test campaign',
        topic: {
          id: '42',
          type: 'topic',
          name: 'test topic',
        },
      },
      meta: {},
    });
  });
});
