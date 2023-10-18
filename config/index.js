const dotenv = require('dotenv');

dotenv.config({ path: '.env' });

const appConfig = {
  DATABASE_URI: process.env.DATABASE_URI,
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  JWT_SALT: process.env.JWT_SALT,
};

module.exports = appConfig;
