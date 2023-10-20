const router = require('express').Router();

const { departmentController } = require('../controllers');
const { departmentValidator } = require('../validators');

router
  .route('/')
  .get(departmentValidator.findAll, departmentController.findAll)
  .post(departmentValidator.create, departmentController.create);

router
  .route('/:departmentId')
  .get(departmentValidator.findById, departmentController.findById)
  .delete(departmentValidator.deleteById, departmentController.deleteById)
  .patch(departmentValidator.updateById, departmentController.updateById);

module.exports = router;
