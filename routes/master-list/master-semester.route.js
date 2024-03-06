const router = require('express').Router();

const {
  masterSemesterController,
  masterSubjectGroupController,
} = require('../../controllers/master-list');
const {
  masterSemesterValidator,
  masterSubjectGroupValidator,
} = require('../../validators/master-list');

router
  .route('/:semesterId')
  .get(masterSemesterValidator.findById, masterSemesterController.findById)
  .delete(
    masterSemesterValidator.deleteById,
    masterSemesterController.deleteById,
  )
  .patch(
    masterSemesterValidator.updateById,
    masterSemesterController.updateById,
  );

router
  .route('/:semesterId/subjects-groups')
  .post(masterSubjectGroupValidator.create, masterSubjectGroupController.create)
  .get(
    masterSubjectGroupValidator.findAll,
    masterSubjectGroupController.findAll,
  );

module.exports = router;
