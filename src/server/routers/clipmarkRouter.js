const { router } = require('../core/router');
const { send } = require('../core/responseHelper');
const {
  createClipmark,
  executeCommand,
  loadClipmark
} = require('../services/clipmark');
const clipmarkRouter = router();

clipmarkRouter.post('/create-clipmark', (req, res) => {
  const message = createClipmark(req.body);

  send(res, { message });
});

clipmarkRouter.get('/load-clipmark', (req, res) => {
  const clipmark = loadClipmark();

  send(res, { clipmark });
});

clipmarkRouter.post('/execute-command', (req, res) => {
  const message = executeCommand(req.body.command);

  send(res, { message });
});

module.exports = { clipmarkRouter };