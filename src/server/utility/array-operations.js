const flatten = (arr = []) => arr.reduce((accumulator, item) => accumulator.concat(item), []);

const flattenDeep = (arr = []) =>
  (Array.isArray(arr) ? arr.reduce((a, b) => [...flattenDeep(a), ...flattenDeep(b)], []) : [arr]);

module.exports = {
  flatten,
  flattenDeep
};
