'use strict';

const fp = require('lodash/fp');

const { path, reduce: reduceFp, flow, find } = fp;

const reduce = reduceFp.convert({ cap: false });

const getAttributes = path('attributes');
const getRelationships = path('relationships');

const polyfillRelationships = included =>
  flow(
    getRelationships,

    reduce((acc, relationRecord, key) => {
      const extendRelationRecord =
        find(
          inc => inc.type === relationRecord.data.type && inc.id === relationRecord.data.id,
          included
        ) || relationRecord;

      if (!extendRelationRecord) {
        return acc;
      }

      let polyfills = getAttributes(extendRelationRecord);
      if (getRelationships(extendRelationRecord)) {
        polyfills = {
          ...polyfills,
          ...polyfillRelationships(included)(extendRelationRecord),
        };
      }

      return {
        ...acc,
        [key]: {
          id: extendRelationRecord.id,
          type: extendRelationRecord.type,
          ...polyfills,
        },
      };
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
