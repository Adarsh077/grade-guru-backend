const router = require('express').Router();

const {
  masterSubjectGroupController,
  masterSubjectController,
} = require('../../controllers/master-list');
const {
  masterSubjectGroupValidator,
  masterSubjectValidator,
} = require('../../validators/master-list');

router
  .route('/:subjectGroupId')
  .get(
    masterSubjectGroupValidator.findById,
    masterSubjectGroupController.findById,
  )
  .patch(
    masterSubjectGroupValidator.updateById,
    masterSubjectGroupController.updateById,
  )
  .delete(
    masterSubjectGroupValidator.deleteById,
    masterSubjectGroupController.deleteById,
  );

router
  .route('/:subjectGroupId/subjects')
  .post(masterSubjectValidator.create, masterSubjectController.create)
  .get(masterSubjectValidator.findAll, masterSubjectController.findAll);

module.exports = router;
