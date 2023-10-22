const router = require('express').Router();

const { userController } = require('../controllers');
const { userValidator } = require('../validators');

router.get('/', userController.getUserDetails);
router.get('/search', userValidator.search, userController.search);

router
  .route('/ability')
  .put(userValidator.updateUserAbilties, userController.updateUserAbilties)
  .get(userController.getUserAbilityStatements);

module.exports = router;
