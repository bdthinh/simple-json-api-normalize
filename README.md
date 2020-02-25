# SIMPLE json-api normalize

A simple way to normalize datasets based on JSON API specification to powerful objects and their relationships
so that you can use directly and natively.
Normalizer is a lightweight javascript library with simple and powerful api.

json:api is a specification for building apis in JSON.
If you are new to JSON api we recommend you browse [json api website](http://jsonapi.org/) and [examples](http://jsonapi.org/examples/) to familiarize yourself with specification. This library is built upon standards and conventions of JSON api and provides a simple way to traverse and retrieve all those attributes and relations.

## Examples

This normalizer only works with json:api response having key `jsonapi` at root.

```js
jsonapi: {
  version: 'xxx';
}
```

Lets start with a typical JSON api formatted dataset:

### Single resource object

```js
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
const data = normalize(response);

expect(data).toEqual({
  id: '55',
  type: 'task',
  subject: 'Re: [To: ["max+redis_01@saleswhale.com"]]Hi Max Redis',
  body: 'Will you be free for a call sometime this or next week',
  meta: {},
});
```

The normalzer will append `meta` key to each object.

### Array of resource objects

```js
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

const data = normalize(response);

expect(data).toEqual([
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
```

The normalzer will append `meta` key to each object.

### Resource object with relationships and included

```js
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

const data = normalize(response);

expect(data).toEqual({
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
```

## Installation

Json api normalize is packaged so you can use it both on client and server (CommonJS and AMD environment) or with browser globals.

```js
// install via npm
npm install simple-json-api-normalize --save

// install via yarn
yarn install simple-json-api-normalize

// if you use bundler
const normalize = require('json-api-normalize');
```
