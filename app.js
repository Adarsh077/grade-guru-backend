const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const AppError = require('./utils/appError');
const { errorController } = require('./controllers');
const appConfig = require('./config');

const app = express();

/* MIDDLEWARES 👇 */
if (appConfig.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(cors());
app.use(express.json());

/* Routes 🎯 */
app.use('/api', require('./routes'));

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

/* Error handling 💥 */
app.use(errorController);

module.exports = app;
