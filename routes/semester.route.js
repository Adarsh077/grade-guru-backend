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
  .route('/:semesterId/students')
  .get(
    semesterValidator.findRegisteredStudents,
    semesterController.findRegisteredStudents,
  );

router
  .route('/:semesterId/enrolled-students')
  .get(
    semesterValidator.enrolledStudentList,
    semesterController.enrolledStudentList,
  );

router
  .route('/:semesterId/enroll-students-in-nss')
  .post(semesterController.enrollStudentsInNss);

router
  .route('/:semesterId/subject-groups')
  .post(subjectGroupValidator.create, subjectGroupController.create)
  .get(subjectGroupValidator.findAll, subjectGroupController.findAll);

router
  .route('/:semesterId/result')
  .get(semesterValidator.generateResult, semesterController.generateResult);

module.exports = router;
