'use strict';

const getAttributes = record => record && record.attributes;
const getRelationships = record => record && record.relationships;

const polyfillAttributes = (included = []) => record => {
  const relationships = getRelationships(record);
  if (!relationships) return [];

  return Object.keys(relationships).reduce((acc, key) => {
    const currentRelation = relationships[key];
    const extendRelation =
      included.find(
        inc => inc.type === currentRelation.data.type && inc.id === currentRelation.data.id
      ) || currentRelation;

    if (!extendRelation) return acc;

    let polyfill = getAttributes(extendRelation);
    if (getRelationships(extendRelation)) {
      polyfill = {
        ...polyfill,
        ...polyfillAttributes(included)(extendRelation),
      };
    }

    return {
      ...acc,
      [key]: {
        id: extendRelation.id,
        type: extendRelation.type,
        ...polyfill,
      },
    };
  }, {});
};

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
      ...polyfillAttributes(included)(record),
      meta,
    }));
  }

  return {
    id: data.id,
    type: data.type,
    ...getAttributes(data),
    ...polyfillAttributes(included)(data),
    meta,
  };
};

module.exports = normalize;
