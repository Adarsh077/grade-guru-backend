const router = require('express').Router();

const { semesterController } = require('../controllers');
const { semesterValidator } = require('../validators');

router
  .route('/:semesterId')
  .get(semesterValidator.findById, semesterController.findById)
  .delete(semesterValidator.deleteById, semesterController.deleteById)
  .patch(semesterValidator.updateById, semesterController.updateById);

module.exports = router;
