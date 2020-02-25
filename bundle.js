"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var getAttributes = function getAttributes(record) {
  return record && record.attributes;
};

var getRelationships = function getRelationships(record) {
  return record && record.relationships;
};

var polyfillAttributes = function polyfillAttributes() {
  var included = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  return function (record) {
    var relationships = getRelationships(record);
    if (!relationships) return [];
    return Object.keys(relationships).reduce(function (acc, key) {
      var currentRelation = relationships[key];
      var extendRelation = included.find(function (inc) {
        return inc.type === currentRelation.data.type && inc.id === currentRelation.data.id;
      }) || currentRelation;
      if (!extendRelation) return acc;
      var polyfill = getAttributes(extendRelation);

      if (getRelationships(extendRelation)) {
        polyfill = _objectSpread({}, polyfill, {}, polyfillAttributes(included)(extendRelation));
      }

      return _objectSpread({}, acc, _defineProperty({}, key, _objectSpread({
        id: extendRelation.id,
        type: extendRelation.type
      }, polyfill)));
    }, {});
  };
};

var normalize = function normalize(response) {
  if (!response.jsonapi || !response.data) {
    return response;
  }

  var data = response.data,
      included = response.included,
      _response$meta = response.meta,
      meta = _response$meta === void 0 ? {} : _response$meta;

  if (Array.isArray(data)) {
    return data.map(function (record) {
      return _objectSpread({
        id: record.id,
        type: record.type
      }, getAttributes(record), {}, polyfillAttributes(included)(record), {
        meta: meta
      });
    });
  }

  return _objectSpread({
    id: data.id,
    type: data.type
  }, getAttributes(data), {}, polyfillAttributes(included)(data), {
    meta: meta
  });
};

module.exports = normalize;
