const router = require('express').Router();

const { resultController } = require('../controllers');
const authMiddleware = require('../middlewares/auth.middleware');
const CaslMiddleware = require('../middlewares/casl.middleware');

router.use('/auth', require('./auth.route'));

router.get('/semesters/:semesterId/result', resultController.findOne);

router.use(authMiddleware);
router.use(CaslMiddleware.attachUserAbility);

router.use(
  '/master/departments',
  require('./master-list/master-department.route'),
);

router.use('/master/semesters', require('./master-list/master-semester.route'));
router.use(
  '/master/subject-groups',
  require('./master-list/master-student-group.route'),
);
router.use('/master/subjects', require('./master-list/master-subject.route'));

router.use('/user', require('./user.route'));
router.use('/batches', require('./batch.route'));
router.use('/departments', require('./department.route'));
router.use('/semesters', require('./semester.route'));
router.use('/subjects', require('./subject.route'));
router.use('/subject-groups', require('./student-group.route'));
router.use('/students', require('./student.route'));

module.exports = router;
