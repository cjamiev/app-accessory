const xOr = (a, b) => {
  return (!a && b) || (a && !b);
};

const isNil = value => value === null || value === undefined;

const isObjectLike = value => value !== null && typeof value === 'object';

const isNotEmpty = targetObject => {
  if (!targetObject || Object.keys(targetObject).length === 0) {
    return false;
  }

  const entries = Object.keys(targetObject);
  const atLeastOneNotNull = entries.some(key => !isNil(targetObject[key]));

  return atLeastOneNotNull;
};

const isEmpty = targetObject => {
  return !isNotEmpty(targetObject);
};

const cloneDeep = targetObject => {
  const entries = Object.keys(targetObject);

  const clone = entries.reduce((accumulator, key) => {
    if (targetObject[key] !== null && typeof targetObject[key] === 'object') {
      return { ...accumulator, [key]: cloneDeep(targetObject[key]) };
    } else {
      return { ...accumulator, [key]: targetObject[key] };
    }
  }, {});

  return clone;
};

const isEqual = (object1, object2) => {
  const isObject1Empty = isEmpty(object1);
  const isObject2Empty = isEmpty(object2);

  if (xOr(isObject1Empty, isObject2Empty)) {
    return false;
  }

  const entries1 = Object.keys(object1);
  const entries2 = Object.keys(object2);

  if (entries1.length !== entries2.length) {
    return false;
  }

  const checkEquality = entries1.reduce((accumulator, key) => {
    if (isObjectLike(object1[key]) && isObjectLike(object2[key])) {
      const equality = isEqual(object1[key], object2[key]);

      return accumulator && equality;
    } else {
      return accumulator && object1[key] === object2[key];
    }
  }, true);

  return checkEquality;
};

const mapObject = func => targetObject => {
  const keys = Object.keys(targetObject);
  const mappedObject = keys.reduce((accumulator, item) => {
    const mappedValue = func(targetObject[item]);
    console.log

    return { ...accumulator, [item]: mappedValue }
  }, {});

  return mappedObject;
}

const removeProperty = prop => ({ [prop]: _, ...rest }) => rest

module.exports = {
  cloneDeep,
  isEmpty,
  isEqual,
  isNil,
  isNotEmpty,
  isObjectLike,
  mapObject,
  removeProperty
};
