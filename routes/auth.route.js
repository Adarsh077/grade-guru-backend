const router = require('express').Router();

const { authController } = require('../controllers');
const { authValidator } = require('../validators');

router.post('/register', authValidator.register, authController.register);
router.post('/login', authValidator.login, authController.login);

module.exports = router;
