const router = require('express').Router();

const { userController } = require('../controllers');

router.get('/', userController.getUserDetails);
router.get('/search', userController.search);

module.exports = router;
