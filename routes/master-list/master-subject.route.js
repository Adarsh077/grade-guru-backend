const router = require('express').Router();

const { masterSubjectController } = require('../../controllers/master-list');
const { masterSubjectValidator } = require('../../validators/master-list');

router
  .route('/:subjectId')
  .get(masterSubjectValidator.findById, masterSubjectController.findById)
  .delete(masterSubjectValidator.deleteById, masterSubjectController.deleteById)
  .patch(masterSubjectValidator.updateById, masterSubjectController.updateById);

module.exports = router;
