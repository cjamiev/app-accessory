import fs from 'fs';
import { getAllFilesInTreeDirectory } from '../my_modules';

const mockServiceFiles = getAllFilesInTreeDirectory('./storage/mock-services');

const mockFiles = mockServiceFiles.map(fileName => {
  const file = fs.readFileSync(fileName, 'utf8');
  const cleanLines = file.split('\n').map(line => line.trim().replace(/[^\x20-\x7E]/g, ''));
  const cleanFile = cleanLines.join('');

  return JSON.parse(cleanFile);
});

const mockGets = mockFiles.filter(file => (file.type).toUpperCase()==='GET');
const mockPosts = mockFiles.filter(file => (file.type).toUpperCase()==='POST');

export {
  mockGets,
  mockPosts
};