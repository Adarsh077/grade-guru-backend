const router = require('express').Router();

const { batchController } = require('../controllers');
const { batchValidator } = require('../validators');

router
  .route('/')
  .get(batchController.findAll)
  .post(batchValidator.create, batchController.create);

module.exports = router;
