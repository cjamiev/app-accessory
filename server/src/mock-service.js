const fs = require('fs'); 
const getAllFilesInTreeDirectory = require('../utility/file').getAllFilesInTreeDirectory;

const mockServiceFiles = getAllFilesInTreeDirectory('./server/mock-services');

const mockFiles = mockServiceFiles.map(fileName => {
  const file = fs.readFileSync(fileName, 'utf8');
  const cleanLines = file.split('\n').map(line => line.trim().replace(/[^\x20-\x7E]/g, ''));
  const cleanFile = cleanLines.join('');

  return JSON.parse(cleanFile);
});

const mockGets = mockFiles.filter(file => (file.type).toUpperCase()==='GET');
const mockPosts = mockFiles.filter(file => (file.type).toUpperCase()==='POST');

module.exports.mockGets = mockGets;
module.exports.mockPosts = mockPosts;