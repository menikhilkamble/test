var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
const cors = require("cors");
var encodeUrl = require('encodeurl');
const handlebars = require('express-handlebars');
const cron = require('node-cron');
var sendMail = require('./helpers/mailer');

// var testRouter = require('./routes/test.routes');
var usermasterRouter = require('./routes/usermaster.routes');

const app = express();

app.set('view engine', 'handlebars');

app.engine('handlebars', handlebars({
layoutsDir: __dirname + '/views/layouts',
}));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
  next();
});

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));

// app.use('/test', testRouter);
app.use('/usermaster', usermasterRouter);

const db = require("./models");
db.sequelize.sync();

app.use(express.static('public'))

app.get("/", (req, res) => {
  res.render('main', {layout : 'index'});
});

app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ error: err })
});

cron.schedule("*/10 * * * * *", function() {
  console.log("running a task every 10 second");
  sendMail.sendMail();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

