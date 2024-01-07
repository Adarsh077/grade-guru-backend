const router = require('express').Router();

const {
  semesterController,
  subjectController,
  studentsBySemesterController,
} = require('../controllers');
const {
  semesterValidator,
  subjectValidator,
  studentsBySemesterValidator,
} = require('../validators');

router
  .route('/:semesterId')
  .get(semesterValidator.findById, semesterController.findById)
  .delete(semesterValidator.deleteById, semesterController.deleteById)
  .patch(semesterValidator.updateById, semesterController.updateById);

router
  .route('/:semesterId/subjects')
  .post(subjectValidator.create, subjectController.create)
  .get(subjectValidator.findAll, subjectController.findAll);

router
  .route('/:semesterId/students')
  .post(
    studentsBySemesterValidator.addBySemesterId,
    studentsBySemesterController.addStudents,
  )
  .get(
    studentsBySemesterValidator.findOneBySemesterId,
    studentsBySemesterController.findOneBySemesterId,
  )
  .patch(
    studentsBySemesterValidator.updateBySemesterId,
    studentsBySemesterController.updateBySemesterId,
  );

module.exports = router;
