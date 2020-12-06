const { isBoolean, isNumber, isObject, loadJSONFromFile, updateFile, deleteFile } = require('./util');

const ENTRY_ALREADY_EXISTS_MESSAGE = 'A mock with the specified method and url already exists.';
const CONFIG_SUCCESS_MESSAGE = 'Updated configuration';
const CONFIG_OVERRIDE_PATH = './storage/mock/config.json';
const MOCK_FILE_PATH = './storage/mock/responses';
const MOCK_REQUESTS_PATH = './storage/mock/mockPaths.json';
const LOGFILE_PATH = './storage/mock/log.json';
const DEFAULT_CONFIG = {
  delay: 0,
  delayUrls: [],
  log: false,
  error: false,
  overrideUrls: [],
  overrideStatusCode: 200,
  overrideResponse: {}
};

const loadMockRequests = () => {
  return loadJSONFromFile(MOCK_REQUESTS_PATH, []);
};

const loadMockResponse = (filepath) => {
  return loadJSONFromFile(filepath, []);
};

const getMatchedMockResponse = (url, method) => {
  const mockRequests = loadMockRequests();
  const matchedMockRequest = mockRequests.find((entry) => entry.url === url && entry.method === method);
  if (matchedMockRequest) {
    return loadMockResponse(matchedMockRequest.responsePath);
  }

  return null;
};

const updateMockRequests = (request, filename) => {
  const mockRequests = loadMockRequests();

  const matched = mockRequests.find((entry) => entry.url === request.url && entry.method === request.method);

  if (matched) {
    return ENTRY_ALREADY_EXISTS_MESSAGE;
  }

  const newEntry = {
    ...request,
    responsePath: MOCK_FILE_PATH + '/' + filename
  };

  const updatedMockRequests = mockRequests.concat([newEntry]);

  return updateFile(MOCK_REQUESTS_PATH, updatedMockRequests);
};

const createMockFile = ({ content, filename }) => {
  const messageOne = updateMockRequests(content.request, filename);

  if (messageOne) {
    return { message: messageOne, error: true };
  } else {
    const message = updateFile(MOCK_FILE_PATH + '/' + filename, content.response);

    return message ? { message, error: true } : { message };
  }
};

const updateMockFile = ({ content }) => {
  const mockRequests = loadMockRequests();
  const matched = mockRequests.find(
    (entry) => entry.url === content.request.url && entry.method === content.request.method
  );

  const message = updateFile(matched.responsePath, content.response);

  return message;
};

const removeMockRequestsEntry = ({ url, method, responsePath }) => {
  const mockRequests = loadMockRequests();

  const updatedMockRequests = !mockRequests.length
    ? []
    : mockRequests.filter((entry) => !(entry.url === url && entry.method === method));

  deleteFile(responsePath);

  return updateFile(MOCK_REQUESTS_PATH, updatedMockRequests);
};

const constructValidConfig = (payloadConfig) => {
  const existingConfig = loadConfiguration();

  const delay = isNumber(payloadConfig.delay) ? payloadConfig.delay : existingConfig.delay;
  const delayUrls = Array.isArray(payloadConfig.delayUrls) ? payloadConfig.delayUrls : existingConfig.delayUrls;
  const log = isBoolean(payloadConfig.log) ? payloadConfig.log : existingConfig.log;
  const logfile = isBoolean(payloadConfig.logfile) ? payloadConfig.logfile : existingConfig.logfile;
  const error = isBoolean(payloadConfig.error) ? payloadConfig.error : existingConfig.error;
  const overrideUrls = Array.isArray(payloadConfig.overrideUrls)
    ? payloadConfig.overrideUrls
    : existingConfig.overrideUrls;
  const overrideStatusCode = isNumber(payloadConfig.overrideStatusCode)
    ? payloadConfig.overrideStatusCode
    : existingConfig.overrideStatusCode;
  const overrideResponse = isObject(payloadConfig.overrideResponse)
    ? payloadConfig.overrideResponse
    : existingConfig.overrideResponse;

  return {
    delay,
    delayUrls,
    log,
    logfile,
    error,
    overrideUrls,
    overrideStatusCode,
    overrideResponse
  };
};

const loadConfiguration = () => {
  const configFile = loadJSONFromFile(CONFIG_OVERRIDE_PATH, DEFAULT_CONFIG);
  const parsedConfigFile = {
    ...DEFAULT_CONFIG,
    ...configFile
  };

  return parsedConfigFile;
};

const updateConfiguration = (payloadConfig) => {
  const updatedConfig = constructValidConfig(payloadConfig);
  const errorMessage = updateFile(CONFIG_OVERRIDE_PATH, updatedConfig);

  return errorMessage ? errorMessage : CONFIG_SUCCESS_MESSAGE;
};

const loadLog = () => {
  return loadJSONFromFile(LOGFILE_PATH, []);
};

const logEntry = (url, payload) => {
  const date = new Date();
  const timestamp = `${
    date.getMonth() + 1
  }/${date.getDate()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

  const currentLog = loadLog();
  const updatedLog = currentLog.concat([{ timestamp, url, payload }]);

  updateFile(LOGFILE_PATH, updatedLog);
};

const clearLog = () => {
  return updateFile(LOGFILE_PATH, []);
};

module.exports = {
  createMockFile,
  updateMockFile,
  removeMockRequestsEntry,
  loadMockRequests,
  loadMockResponse,
  getMatchedMockResponse,
  loadConfiguration,
  updateConfiguration,
  loadLog,
  logEntry,
  clearLog
};
