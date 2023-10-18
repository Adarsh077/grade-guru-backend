const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { userDataLayer } = require('../data');
const appConfig = require('../config');
const { AppError } = require('../utils');

class UserService {
  async getJwtTokenByUserId(userId) {
    let { user } = await userDataLayer.findById(userId);

    if (!user) {
      throw new AppError({ message: ['User not found!'] }, 404);
    }

    user = {
      _id: user._id,
      name: user.name,
      email: user.email,
    };

    const token = jwt.sign(user, appConfig.JWT_SALT);

    return { token };
  }

  async register(data) {
    const { name, email, password } = data;

    const { user: existingUser } = await userDataLayer.findOne({
      email: email,
    });

    if (existingUser) {
      throw new AppError({ message: ['Email is already taken!'] }, 400);
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const { user } = await userDataLayer.createUser({
      name,
      email,
      password: hashedPassword,
    });

    const { token } = await this.getJwtTokenByUserId(user._id);

    return { token };
  }

  async login(data) {
    const { email, password } = data;

    const { user } = await userDataLayer.findOne({
      email: email,
    });

    if (!user) {
      throw new AppError({ message: ['Email is not registered!'] }, 400);
    }

    const isPasswordCorrect = bcrypt.compareSync(password, user.password);

    if (!isPasswordCorrect) {
      const errMessage = { message: ['Password is incorrect'] };
      throw new AppError(errMessage, 400);
    }

    const { token } = await this.getJwtTokenByUserId(user._id);

    return { token };
  }
}

module.exports = new UserService();
