const { router } = require('../core/router');
const { send } = require('../core/responseHelper');
const {
  addClipboardEntry,
  deleteClipboardEntry,
  loadClipboardEntries,
  createClipmark,
  executeCommand
} = require('../services/clipmark');
const clipmarkRouter = router();

clipmarkRouter.post('/add-clipboard-entry', (req, res) => {
  const message = addClipboardEntry(req.body);

  send(res, { message });
});

clipmarkRouter.post('/delete-clipboard-entry', (req, res) => {
  const message = deleteClipboardEntry(req.body.name);

  send(res, { message });
});

clipmarkRouter.get('/load-clipboard-entries', (req, res) => {
  const clipboards = loadClipboardEntries();

  send(res, { clipboards });
});

clipmarkRouter.post('/execute-command', (req, res) => {
  const message = executeCommand(req.body.command);

  send(res, { message });
});

module.exports = { clipmarkRouter };