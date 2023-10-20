const router = require('express').Router();

const { subjectController } = require('../controllers');
const { subjectValidator } = require('../validators');

router
  .route('/:subjectId')
  .get(subjectValidator.findById, subjectController.findById)
  .delete(subjectValidator.deleteById, subjectController.deleteById)
  .patch(subjectValidator.updateById, subjectController.updateById);

module.exports = router;
