const router = require('express').Router();

const { resultController } = require('../controllers');
const authMiddleware = require('../middlewares/auth.middleware');
const CaslMiddleware = require('../middlewares/casl.middleware');

router.use('/auth', require('./auth.route'));

router.get('/semesters/:semesterId/result', resultController.findOne);

router.use(authMiddleware);
router.use(CaslMiddleware.attachUserAbility);

router.use('/user', require('./user.route'));
router.use('/batches', require('./batch.route'));
router.use('/departments', require('./department.route'));
router.use('/semesters', require('./semester.route'));
router.use('/subjects', require('./subject.route'));

module.exports = router;
