const router = require('express').Router();

const { studentController } = require('../controllers');
const { studentValidator } = require('../validators');

router
  .route('/')
  .post(studentValidator.create, studentController.create)
  .get(studentValidator.find, studentController.find);

router
  .route('/:studentId')
  .patch(studentValidator.update, studentController.update)
  .delete(studentValidator.delete, studentController.delete);

module.exports = router;
