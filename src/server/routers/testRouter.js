const { router } = require('../core/router');
const { send } = require('../core/responseHelper');
const testRouter = router();

testRouter.get('/test', (req, res) => {
  send(res, { message: 'testing get from testRouter' });
});
testRouter.post('/test', (req, res) => {
  send(res, req.body);
});

module.exports = { testRouter };