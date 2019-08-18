const { router } = require('../core/router');
const { send } = require('../core/responseHelper');
const {
  addClipmarkEntry,
  deleteClipmarkEntry,
  loadClipmarkEntries,
  executeCommand
} = require('../services/clipmark');
const clipmarkRouter = router();

clipmarkRouter.post('/add-clipmark-entry', (req, res) => {
  const message = addClipmarkEntry(req.body);

  send(res, { message });
});

clipmarkRouter.post('/delete-clipmark-entry', (req, res) => {
  const message = deleteClipmarkEntry(req.body);

  send(res, { message });
});

clipmarkRouter.get('/load-clipmark-entries', (req, res) => {
  const clipmarks = loadClipmarkEntries();

  send(res, { clipmarks });
});

clipmarkRouter.post('/execute-command', (req, res) => {
  const message = executeCommand(req.body.command);

  send(res, { message });
});

module.exports = { clipmarkRouter };