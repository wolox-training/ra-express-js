const userController = require('./controllers/users'),
  generics = require('./middlewares/generics'),
  albumController = require('./controllers/albums');

exports.init = app => {
  app.post('/users', userController.createUser);

  app.post('/users/sessions', userController.logIn);

  app.get('/users', generics.verifyToken, userController.listUsers);

  app.post('/admin/users', generics.verifyAdministratorToken, userController.createAdminUser);

  app.get('/albums', generics.verifyToken, albumController.getAllAlbums);

  app.post('/albums/:id', generics.verifyToken, albumController.buyAlbum);
};
