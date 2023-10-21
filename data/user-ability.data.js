const mongoose = require('mongoose');
const { UserAbilityModel } = require('../models');

class UserAbilityDataLayer {
  async upsert(data) {
    const { userId, statements } = data;

    const userAbility = await UserAbilityModel.findOneAndUpdate(
      {
        userId: new mongoose.Types.ObjectId(userId),
      },
      { statements },
      { new: true, upsert: true },
    );

    return { userAbility };
  }

  async findOne({ userId }) {
    const userAbility = await UserAbilityModel.findOne({
      userId: new mongoose.Types.ObjectId(userId),
    });

    return { userAbility };
  }

  async findAll() {
    const userAbilities = await UserAbilityModel.find();

    return { userAbilities };
  }
}

module.exports = new UserAbilityDataLayer();
