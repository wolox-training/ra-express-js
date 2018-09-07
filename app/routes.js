const models = require('./models');

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
      if (!models.User.obligatoryParametersWereReceived(Object.keys(req.body)))
        return res.status(400).send('Missing obligatory parameters');
      next();
    },
    function(req, res, next) {
      if (!models.User.emailIsValid(req.body.email)) return res.status(400).send('Invalid email');
      next();
    },
    function(req, res, next) {
      if (!models.User.passwordIsValid(req.body.password)) return res.status(400).send('Invalid password');
      next();
    },
    function(req, res, next) {
      models.User.emailIsAvailable(req.body.email)
        .then(isAvailable => {
          if (isAvailable) return next();
          return res.status(400).send('Email is already in use');
        })
        .catch(error => {
          console.log(error.message);
          return res.status(503).send(error.message);
        });
    },
    function(req, res, next) {
      models.User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password
      })
        .then(user => {
          user.printAfterCreationMessage();
          next();
        })
        .catch(error => {
          console.log(error.message);
          return res.status(503).send(error.message);
        });
    },
    function(req, res) {
      return res.send(200);
    }
  );
};
