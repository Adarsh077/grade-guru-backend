const router = require('express').Router();

const { userController } = require('../controllers');
const { userValidator } = require('../validators');

router.get('/', userController.getUserDetails);
router.get('/search', userValidator.search, userController.search);
router.put(
  '/ability',
  userValidator.updateUserAbilties,
  userController.updateUserAbilties,
);

module.exports = router;
