const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { userDataLayer } = require('../data');
const appConfig = require('../config');
const { AppError } = require('../utils');
const RoleAbilities = require('../constants/abilities');
const userAbilityService = require('./user-ability.service');

class UserService {
  async getUserDetails(userId) {
    let { user } = await userDataLayer.findById(userId);

    if (!user) {
      throw new AppError({ message: 'User not found!' }, 404);
    }

    user = {
      _id: user._id,
      name: user.name,
      email: user.email,
    };

    return { user };
  }

  async search({ query }) {
    const { users } = await userDataLayer.search({
      query,
    });

    if (!users) {
      return { users: [] };
    }

    return { users };
  }

  async getJwtTokenByUserId(userId) {
    let { user } = await userDataLayer.findById(userId);

    if (!user) {
      throw new AppError({ message: 'User not found!' }, 404);
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
    const { name, email, password, role } = data;

    const { user: existingUser } = await userDataLayer.findOne({
      email: email,
    });

    if (existingUser) {
      throw new AppError({ email: 'Email is already registered!' }, 400);
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const { user } = await userDataLayer.createUser({
      name,
      email,
      password: hashedPassword,
    });

    await this.updateUserAbilities({ role, userId: user._id });

    const { token } = await this.getJwtTokenByUserId(user._id);

    return { token };
  }

  async login(data) {
    const { email, password } = data;

    const { user } = await userDataLayer.findOne({
      email: email,
    });

    if (!user) {
      throw new AppError({ email: 'Email is not registered!' }, 400);
    }

    const isPasswordCorrect = bcrypt.compareSync(password, user.password);

    if (!isPasswordCorrect) {
      const errMessage = { password: 'Password is incorrect!' };
      throw new AppError(errMessage, 400);
    }

    const { token } = await this.getJwtTokenByUserId(user._id);

    return { token };
  }

  async updateUserAbilities({ userId, role }) {
    const statements = RoleAbilities[role];
    if (
      statements &&
      typeof statements === 'object' &&
      Object.keys(statements).length
    ) {
      await userAbilityService.upsert({
        userId: userId,
        statements: statements,
      });
    }
  }
}

module.exports = new UserService();
