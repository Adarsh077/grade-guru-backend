const router = require('express').Router();

const { subjectGroupController } = require('../controllers');
const { subjectGroupValidator } = require('../validators');

router
  .route('/:subjectGroupId')
  .get(subjectGroupValidator.findById, subjectGroupController.findById)
  .patch(subjectGroupValidator.updateById, subjectGroupController.updateById)
  .delete(subjectGroupValidator.deleteById, subjectGroupController.deleteById);

module.exports = router;
