const { userAbilityDataLayer } = require('../data');

class UserAbilityService {
  async upsert(data) {
    const { userId, statements } = data;

    const { userAbility } = await userAbilityDataLayer.upsert({
      userId,
      statements,
    });

    return { userAbility };
  }

  async findAll() {
    const { userAbilities } = await userAbilityDataLayer.findAll();
    return { userAbilities };
  }

  async findOne({ userId }) {
    const { userAbility } = await userAbilityDataLayer.findOne({ userId });

    if (!userAbility) {
      // throw new AppError({ message: 'User has no permissions!' }, 404);
      return { userAbility: null };
    }

    return { userAbility };
  }
}

module.exports = new UserAbilityService();
