/* eslint-disable no-console */
process.stdout.write('\x1Bc');
const mongoose = require('mongoose');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

const app = require('./app');
const appConfig = require('./config');

mongoose
  .connect(appConfig.DATABASE_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log(`🔥 DB connect to ${appConfig.DATABASE_URI}`));

const port = appConfig.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`🔥 App running on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
