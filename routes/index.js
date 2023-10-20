const router = require('express').Router();

const authMiddleware = require('../middlewares/auth.middleware');

router.use('/auth', require('./auth.route'));

router.use(authMiddleware);

router.use('/user', require('./user.route'));
router.use('/departments', require('./department.route'));

module.exports = router;
