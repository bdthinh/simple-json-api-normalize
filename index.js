'use strict';

const fp = require('lodash/fp');

const { path, reduce, flow, find } = fp;

const reduceWithIndex = reduce.convert({ cap: false });

const getRelationships = path('relationships');

const getAndPolyfillRelationships = included =>
  flow(
    getRelationships,
    reduceWithIndex((acc, relationship, key) => {
      const fullRelationship =
        find(inc => inc.id === relationship.data.id, included) || relationship;
      if (fullRelationship) {
        return {
          ...acc,
          [key]: {
            id: fullRelationship.id,
            ...fullRelationship.attributes,
          },
        };
      }
      return acc;
    }, {})
  );

const getAttributes = path('attributes');

const normalize = response => {
  if (!response.jsonapi) {
    return response;
  }

  const { data, included, meta = {} } = response;
  if (Array.isArray(data)) {
    return data.map(record => ({
      id: record.id,
      type: record.type,
      ...getAttributes(record),
      ...getAndPolyfillRelationships(included)(record),
      meta,
    }));
  }

  return {
    id: data.id,
    type: data.type,
    ...getAttributes(data),
    ...getAndPolyfillRelationships(included)(data),
    meta,
  };
};

module.exports = normalize;
