const router = require('express').Router();

const {
  masterSemesterController,
  masterSubjectController,
} = require('../../controllers/master-list');
const {
  masterSemesterValidator,
  masterSubjectValidator,
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
  .route('/:semesterId/subjects')
  .post(masterSubjectValidator.create, masterSubjectController.create)
  .get(masterSubjectValidator.findAll, masterSubjectController.findAll);

module.exports = router;
