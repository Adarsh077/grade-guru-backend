const { UserModel } = require('../models');

class UserDataLayer {
  async createUser(data) {
    const { name, email, password } = data;

    const user = await UserModel.create({ name, email, password });

    return { user };
  }

  async search({ query }) {
    const users = await UserModel.find({
      $or: [
        { email: new RegExp(query, 'i') },
        { name: new RegExp(query, 'i') },
      ],
    });

    return { users };
  }

  async findOne({ email }) {
    const user = await UserModel.findOne({ email });

    return { user };
  }

  async findAll() {
    const users = await UserModel.find();
    return { users };
  }

  async findById(userId) {
    const user = await UserModel.findById(userId);

    return { user };
  }
}

module.exports = new UserDataLayer();
