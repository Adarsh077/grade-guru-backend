const router = require('express').Router();

const {
  semesterController,
  subjectGroupController,
} = require('../controllers');
const { semesterValidator, subjectGroupValidator } = require('../validators');

router
  .route('/:semesterId')
  .get(semesterValidator.findById, semesterController.findById)
  .delete(semesterValidator.deleteById, semesterController.deleteById)
  .patch(semesterValidator.updateById, semesterController.updateById);

router
  .route('/:semesterId/subject-groups')
  .post(subjectGroupValidator.create, subjectGroupController.create)
  .get(subjectGroupValidator.findAll, subjectGroupController.findAll);

module.exports = router;
