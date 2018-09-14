const userController = require('./controllers/users');

exports.init = app => {
  app.post('/users', userController.createUser);

  app.post('/users/sessions', userController.logIn);
};
