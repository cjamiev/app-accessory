const { isEqual } = require('../src/util');

const log = console.log;

const getFormatedMessage = (testMessage, args, expectedResult, receivedResult) => {
  const failMessage = `\nfail: ${testMessage} \n`;
  const argumentsMessage = args.length > 1 ?
    `${args.map((item, index) => 'input' + (index + 1) + ':' + JSON.stringify(item)).join(',\n')} \n` :
    `input: ${args.map(item => JSON.stringify(item))} \n`;
  const expectedResultMessage = `Expected: ${JSON.stringify(expectedResult)} \n`;
  const receivedResultMessage = `Received: ${JSON.stringify(receivedResult)} \n`;

  return failMessage + argumentsMessage + expectedResultMessage + receivedResultMessage;
};

const executeTests = ({ testMessage = '', args, expectedResult }, functionToTest) => {
  const receivedResult = functionToTest(...args);

  if (isEqual(receivedResult, expectedResult)) {
    return { passed: true, message: `pass: ${testMessage}` };
  } else {
    return {
      passed: false,
      message: getFormatedMessage(testMessage, args, expectedResult, receivedResult)
    };
  }
};

const unitTest = (testData, functionToTest, failOnly = false) => {
  const results = testData.map(testItem => executeTests(testItem, functionToTest));
  const passedCount = results.filter(entry => entry.passed).length;

  results.forEach(entry => {
    if (failOnly && entry.passed) {
      return;
    } else {
      log(entry.message);
    }
  });

  log(`Total Tests: ${testData.length}, Passed: ${passedCount}, Failed: ${testData.length - passedCount}`);
};

module.exports = { unitTest };
