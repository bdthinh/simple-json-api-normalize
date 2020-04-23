const getAttributes = record => record && record.attributes;
const getRelationships = record => record && record.relationships;

const polyfillFullData = (included = []) => compactData => {
  const data =
    included.find(inc => inc.type === compactData.type && inc.id === compactData.id) || compactData;

  let polyfill = getAttributes(data);
  if (getRelationships(data)) {
    polyfill = {
      ...polyfill,
      ...polyfillAttributes(included)(data),
    };
  }

  return {
    id: data.id,
    type: data.type,
    ...polyfill,
  };
};

const polyfillAttributes = (included = []) => record => {
  const relationships = getRelationships(record);
  if (!relationships) return [];

  return Object.keys(relationships).reduce((acc, key) => {
    const currentRelation = relationships[key];

    const relationData = currentRelation.data;
    if (!relationData) return acc;

    let value = undefined;

    if (Array.isArray(relationData)) {
      value = relationData.map(eachRelation => polyfillFullData(included)(eachRelation));
    } else {
      value = polyfillFullData(included)(relationData);
    }
    return {
      ...acc,
      [key]: value,
    };
  }, {});
};

const normalize = response => {
  if (!response.jsonapi && !response.data) {
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
