'use strict';

const fp = require('lodash/fp');

const { path, reduce: reduceFp, flow, find } = fp;

const reduce = reduceFp.convert({ cap: false });

const getAttributes = path('attributes');
const getRelationships = path('relationships');

const polyfillRelationships = included =>
  flow(
    getRelationships,
    reduce((acc, relationship, key) => {
      const fullRelationship =
        find(
          inc => inc.type === relationship.data.type && inc.id === relationship.data.id,
          included
        ) || relationship;
      if (fullRelationship) {
        let polyfills = getAttributes(fullRelationship);

        if (getRelationships(fullRelationship)) {
          polyfills = {
            ...polyfills,
            ...polyfillRelationships(included)(fullRelationship),
          };
        }

        return {
          ...acc,
          [key]: {
            id: fullRelationship.id,
            type: fullRelationship.type,
            ...polyfills,
          },
        };
      }
      return acc;
    }, {})
  );

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
      ...polyfillRelationships(included)(record),
      meta,
    }));
  }

  return {
    id: data.id,
    type: data.type,
    ...getAttributes(data),
    ...polyfillRelationships(included)(data),
    meta,
  };
};

module.exports = normalize;
