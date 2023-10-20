const router = require('express').Router();

const { semesterController, subjectController } = require('../controllers');
const { semesterValidator, subjectValidator } = require('../validators');

router
  .route('/:semesterId')
  .get(semesterValidator.findById, semesterController.findById)
  .delete(semesterValidator.deleteById, semesterController.deleteById)
  .patch(semesterValidator.updateById, semesterController.updateById);

router
  .route('/:semesterId/subjects')
  .post(subjectValidator.create, subjectController.create)
  .get(subjectValidator.findAll, subjectController.findAll);

module.exports = router;
