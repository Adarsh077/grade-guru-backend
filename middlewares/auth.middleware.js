const jwt = require('jsonwebtoken');
const { AppError } = require('../utils');
const appConfig = require('../config');

module.exports = (req, _, next) => {
  const tokenHeader = req.headers.authorization;
  if (!tokenHeader) {
    throw new AppError({ message: 'Your are not authenticated!' }, 403);
  }

  const token = tokenHeader.split('Bearer ')[1];

  if (!token) {
    throw new AppError({ message: 'Your are not authenticated!' }, 403);
  }

  jwt.verify(token, appConfig.JWT_SALT, (err, user) => {
    if (err) {
      throw new AppError({ message: 'Failed to authenticate token.' }, 403);
    }

    req.user = user;
    next();
  });
};
