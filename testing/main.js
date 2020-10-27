// const { loadJSON, loadText } = require('./dependencies');
const { unitTest } = require('./unitTest');
const { comparePerformanceTests, performanceTest } = require('./performanceTest');

const squareTestData = [
  { testMessage: 'zero', args: [0], expectedResult: 0 },
  { testMessage: 'positive', args: [2], expectedResult: 4 },
  { testMessage: 'negative', args: [-2], expectedResult: 4 },
  { testMessage: 'non-integer error', args: ['a'], expectedResult: 'error message' }
];

const square = (value) => {
  return value * value;
};

unitTest(squareTestData, square);