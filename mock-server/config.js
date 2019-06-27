import fs from 'fs';

const MOCK_SERVER_CONFIG_PATH = `storage\\mockServerConfig.json`;
const DEFAULT_CONFIGURATION = {
  port: 3002,
  error: false
};

const getConfigurationFile = () => {
  const configFile = fs.readFileSync(MOCK_SERVER_CONFIG_PATH,'utf8');
  const parsedConfigFile = {
    ...DEFAULT_CONFIGURATION,
    ...JSON.parse(configFile)
  }

  return parsedConfigFile;
}

const getConfiguration = () => {
  return fs.existsSync(MOCK_SERVER_CONFIG_PATH) ? getConfigurationFile(): DEFAULT_CONFIGURATION; 
};

export {
  getConfiguration
};