const router = require('express').Router();

router.use('/auth', require('./auth.route'));
router.use('/departments', require('./department.route'));

module.exports = router;
