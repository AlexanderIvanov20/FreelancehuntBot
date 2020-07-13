const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const indexRouter = require('./routes/index');
const startBot = require('./bots/Bot');
const FreelancehuntScraper = require('./middleware/FreelancehuntScraper');
const { DB_PASSWORD } = require('./config/config');

const app = express();

/* Connect to remote database. */
(async () => {
  try {
    await mongoose.connect(`mongodb+srv://alexander:${DB_PASSWORD}@cluster0.rkfw4.mongodb.net/`, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
  } catch (e) {
    console.log(e);
  }
})();

/* Middleware. */
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);

/* catch 404 and forward to error handler */
app.use((req, res, next) => {
  next(createError(404));
});

/* error handler */
app.use((err, req, res) => {
  /* set locals, only providing error in development */
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  /* render the error page */
  res.status(err.status || 500);
  res.render('error');
});

/* Start running bot script */
startBot();

/* Periodically get new projects and write it into database */
setInterval(() => {
  FreelancehuntScraper.addProjects();
}, 15000);

module.exports = app;
