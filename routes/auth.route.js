const router = require('express').Router();

const { userController } = require('../controllers');
const { authValidator } = require('../validators');

router.post('/register', authValidator.register, userController.register);
router.post('/login', authValidator.login, userController.login);

module.exports = router;
