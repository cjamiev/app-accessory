const {
  isBoolean,
  isNumber,
  isObject,
  loadJSONFromFile,
  updateFile
} = require('./util');

const CONFIG_OVERRIDE_PATH = './storage/config/config.json';
const DEFAULT_CONFIG = {
  delay: 0,
  delayUrls: [],
  log: false,
  error: false,
  overrideUrls: [],
  overrideStatusCode: 200,
  overrideResponse: {}
};

const constructValidConfig = (payloadConfig) => {
  const existingConfig = loadConfiguration();

  const delay = isNumber(payloadConfig.delay) ? payloadConfig.delay : existingConfig.delay;
  const delayUrls = Array.isArray(payloadConfig.delayUrls) ? payloadConfig.delayUrls : existingConfig.delayUrls;
  const log = isBoolean(payloadConfig.log) ? payloadConfig.log : existingConfig.log;
  const logfile = isBoolean(payloadConfig.logfile) ? payloadConfig.logfile : existingConfig.logfile;
  const error = isBoolean(payloadConfig.error) ? payloadConfig.error : existingConfig.error;
  const overrideUrls = Array.isArray(payloadConfig.overrideUrls) ? payloadConfig.overrideUrls : existingConfig.overrideUrls;
  const overrideStatusCode = isNumber(payloadConfig.overrideStatusCode) ? payloadConfig.overrideStatusCode : existingConfig.overrideStatusCode;
  const overrideResponse = isObject(payloadConfig.overrideResponse) ? payloadConfig.overrideResponse : existingConfig.overrideResponse;

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

  return errorMessage ? { message: errorMessage } : { message: 'updated configuration' };
};

module.exports = {
  loadConfiguration,
  updateConfiguration
};