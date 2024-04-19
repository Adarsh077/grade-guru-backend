const router = require('express').Router();

const { departmentController, semesterController } = require('../controllers');
const { departmentValidator, semesterValidator } = require('../validators');

router
  .route('/')
  .get(departmentValidator.findAll, departmentController.findAll)
  .post(departmentController.create);

router
  .route('/:departmentId')
  .get(departmentValidator.findById, departmentController.findById)
  .delete(departmentValidator.deleteById, departmentController.deleteById)
  .patch(departmentValidator.updateById, departmentController.updateById);

router
  .route('/:departmentId/semesters')
  .post(semesterValidator.create, semesterController.create)
  .get(semesterValidator.findAll, semesterController.findAll);

module.exports = router;
