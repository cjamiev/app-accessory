const getUniqueArray = (arr) => {
  return arr.filter((item, pos) => arr.indexOf(item) === pos);
}

module.exports.getUniqueArray = getUniqueArray;