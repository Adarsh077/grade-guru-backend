const { UserModel } = require('../models');

class TodoDataLayer {
  async createUser(data) {
    const { name, email, password } = data;

    const user = await UserModel.create({ name, email, password });

    return { user };
  }

  async findOne({ email }) {
    const user = await UserModel.findOne({ email });

    return { user };
  }

  async findById(userId) {
    const user = await UserModel.findById(userId);

    return { user };
  }
}

module.exports = new TodoDataLayer();
