const router = require('express').Router();

const {
  subjectController,
  marksBySubjectController,
} = require('../controllers');
const { subjectValidator, marksBySubjectValidator } = require('../validators');

router.get(
  '/my',
  subjectValidator.findMySubjects,
  subjectController.findMySubjects,
);

router
  .route('/:subjectId')
  .get(subjectValidator.findById, subjectController.findById)
  .delete(subjectValidator.deleteById, subjectController.deleteById)
  .patch(subjectValidator.updateById, subjectController.updateById);

router.route('/:subjectId/students').post(subjectController.enrollStudent);

router
  .route('/:subjectId/atkt-students')
  .get(subjectController.findATKTStudents);

router
  .route('/:subjectId/students/:studentId')
  .delete(subjectValidator.unEnrollStudent, subjectController.unEnrollStudent);

router
  .route('/:subjectId/students/:studentId/marks')
  .post(
    marksBySubjectValidator.enterMarksFor,
    marksBySubjectController.enterMarksFor,
  );

router
  .route('/:subjectId/marks')
  .get(
    marksBySubjectValidator.getMarksBySubjectId,
    marksBySubjectController.getMarksBySubjectId,
  );

module.exports = router;
