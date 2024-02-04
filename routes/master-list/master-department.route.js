const router = require('express').Router();

const {
  masterDepartmentController,
  masterSemesterController,
} = require('../../controllers/master-list');

const {
  masterDepartmentValidator,
  masterSemesterValidator,
} = require('../../validators/master-list');

router
  .route('/')
  .get(masterDepartmentController.findAll)
  .post(masterDepartmentValidator.create, masterDepartmentController.create);

router
  .route('/:departmentId')
  .get(masterDepartmentValidator.findById, masterDepartmentController.findById)
  .delete(
    masterDepartmentValidator.deleteById,
    masterDepartmentController.deleteById,
  )
  .patch(
    masterDepartmentValidator.updateById,
    masterDepartmentController.updateById,
  );

router
  .route('/:departmentId/semesters')
  .post(masterSemesterValidator.create, masterSemesterController.create)
  .get(masterSemesterValidator.findAll, masterSemesterController.findAll);

module.exports = router;
