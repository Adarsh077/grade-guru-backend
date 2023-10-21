/* eslint-disable no-restricted-syntax */
const CaslFunctions = require('../casl/casl.functions');

class CaslMiddleware {
  static async attachUserAbility(req, res, next) {
    const { user } = req;

    const ability = await CaslFunctions.defineUserAbility(user);

    if (ability) {
      req.user.ability = ability;
    }

    next();
  }
}

module.exports = CaslMiddleware;
