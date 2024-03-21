const router = require('express').Router();

const { subjectGroupController, subjectController } = require('../controllers');
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
  );

router
  .route('/:subjectGroupId/result')
  .get(subjectGroupController.generateResultBy);

module.exports = router;
