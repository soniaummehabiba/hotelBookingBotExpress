const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const mongoose = require('mongoose');
const uri = "mongodb://dbuser:dbuser@cluster0-shard-00-00-twxqe.mongodb.net:27017,cluster0-shard-00-01-twxqe.mongodb.net:27017,cluster0-shard-00-02-twxqe.mongodb.net:27017/admin?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority";
mongoose.connect(uri, {useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', (err) => console.log(`connection error: ${err}`));
db.once('open', () => console.log('database connection success'));

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
