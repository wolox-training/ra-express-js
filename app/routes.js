const models = require('./models');
const bcrypt = require('../node_modules/bcryptjs');

const saltRounds = 10;
const validEmailPattern = /^[a-zA-Z0-9_.+-]+@wolox\.com\.ar$/g;
const validPasswordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/g;

exports.init = app => {
  app.use('*', function(req, res, next) {
    console.log(`A new request received at ${new Date()}`);
    console.log('Request URL:', req.originalUrl);
    console.log('Request Type:', req.method);
    next();
  });

  app.get('/', function(req, res) {
    res.status(200).send('Home Page');
  });

  app.post(
    '/users',
    function(req, res, next) {
      if (!req.body.firstName || !req.body.lastName || !req.body.email || !req.body.password)
        return res.status(400).send('Missing required parameters');
      next();
    },
    function(req, res, next) {
      const email = req.body.email;
      if (!email.match(validEmailPattern)) return res.status(400).send('Invalid email');
      next();
    },
    function(req, res, next) {
      const password = req.body.password;
      if (!password.match(validPasswordPattern)) return res.status(400).send('Invalid password');
      next();
    },
    function(req, res, next) {
      models.User.findOne({
        where: {
          email: req.body.email
        }
      })
        .then(user => {
          if (user) return res.status(400).send('Email is already in use');
          next();
        })
        .catch(error => {
          console.log(error.message);
          return res.status(503).send(error.message);
        });
    },
    function(req, res, next) {
      bcrypt.hash(req.body.password, saltRounds).then(hash => {
        models.User.create({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          password: hash
        })
          .then(user => {
            console.log(`${user.firstName}´s user has been created`);
            next();
          })
          .catch(error => {
            console.log(error.message);
            return res.status(503).send(error.message);
          });
      });
    },
    function(req, res) {
      return res.send(200);
    }
  );
};
