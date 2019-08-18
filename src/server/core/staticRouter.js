const fs = require('fs');
const path = require('path');
const { router } = require('./router');
const {
  send,
  sendHTML,
  sendCSS,
  sendJS
} = require('./responseHelper');
const { readDirectoryDeep } = require('../utility/read');
const staticRouter = router();
const contentTypesByExtension = {
  '.html': sendHTML,
  '.css': sendCSS,
  '.js': sendJS
};

const staticRoute = (filepath) => {
  return (req, res) => {
    fs.readFile(filepath, (err, content) => {
      if (err) {
        send(res, { message: 'not found' });
      } else {
        contentTypesByExtension[path.extname(filepath)](res, content);
      }
    });
  };
};

const mapStaticRoutes = (dir) => {
  const root = dir.replace('./', '').replace(/\//g, '\\');
  const files = readDirectoryDeep(root);

  return files.map(filepath => {
    return {
      url: filepath.replace(root, '/').replace(/\\/g, '/'),
      route: staticRoute(filepath)
    };
  });
};

const addStaticRoutes = (dir) => {
  mapStaticRoutes(dir).forEach(entry => {
    staticRouter.get(entry.url, entry.route);
  });

  return staticRouter;
};

module.exports = {
  addStaticRoutes
};