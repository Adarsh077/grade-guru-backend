const router = require('express').Router();

const {
  masterSubjectGroupController,
} = require('../../controllers/master-list');
const { masterSubjectGroupValidator } = require('../../validators/master-list');

router
  .route('/:subjectGroupId')
  .get(
    masterSubjectGroupValidator.findById,
    masterSubjectGroupController.findById,
  )
  .patch(
    masterSubjectGroupValidator.updateById,
    masterSubjectGroupController.updateById,
  )
  .delete(
    masterSubjectGroupValidator.deleteById,
    masterSubjectGroupController.deleteById,
  );

module.exports = router;
