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

router
  .route('/:subjectId/marks')
  .get(
    marksBySubjectValidator.findOneBySubjectId,
    marksBySubjectController.findOneBySubjectId,
  )
  .patch(
    marksBySubjectValidator.updateMarksOfStudent,
    marksBySubjectController.updateMarksOfStudent,
  );

module.exports = router;
