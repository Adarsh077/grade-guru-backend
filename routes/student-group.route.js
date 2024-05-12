const router = require('express').Router();

const {
  subjectGroupController,
  subjectController,
  resultController,
} = require('../controllers');
const { subjectGroupValidator, subjectValidator } = require('../validators');

router
  .route('/:subjectGroupId')
  .get(subjectGroupValidator.findById, subjectGroupController.findById)
  .patch(subjectGroupValidator.updateById, subjectGroupController.updateById)
  .delete(subjectGroupValidator.deleteById, subjectGroupController.deleteById);

router
  .route('/:subjectGroupId/subjects')
  .post(subjectValidator.create, subjectController.create)
  .get(subjectValidator.findAll, subjectController.findAll);

router
  .route('/:subjectGroupId/students')
  .post(
    subjectGroupValidator.enrollStudents,
    subjectGroupController.enrollStudents,
  )
  .get(subjectGroupController.enrolledStudentList);

router
  .route('/:subjectGroupId/lock')
  .post(subjectGroupController.lockMarksEntry);

router
  .route('/:subjectGroupId/result')
  .post(subjectGroupController.generateResultBy)
  .get(resultController.getResultsBy);

router
  .route('/:subjectGroupId/reminder/revalution')
  .post(subjectGroupController.sendRevaluationReminder);

module.exports = router;
