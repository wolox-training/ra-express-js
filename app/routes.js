const indexController = require('./controllers/index'),
  userController = require('./controllers/users'),
  generics = require('./middlewares/generics');

exports.init = app => {
  app.use(generics.logRequestInformation);

  app.get('/', indexController.home);

  app.post(
    '/users',
    userController.checkIfObligatoryParametersWereReceived,
    userController.validateEmail,
    userController.validatePassword,
    userController.checkIfEmailIsAvailable,
    userController.createUser
  );
};
