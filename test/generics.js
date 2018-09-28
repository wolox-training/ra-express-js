const jwt = require('jsonwebtoken'),
  config = require('../config'),
  enums = require('../app/enums');

module.exports = {
  signIn: user => {
    return new Promise((resolve, reject) => {
      jwt.sign(
        { id: user.id, email: user.email, permission: user.permission },
        config.common.session.secret,
        (err, token) => {
          resolve(token);
        }
      );
    });
  },

  someUser: {
    firstName: 'Federico',
    lastName: 'Diaz',
    email: 'federico.diaz@wolox.com.ar',
    password: '12345678a'
  },

  someUser2: {
    firstName: 'Tomas',
    lastName: 'Gomez',
    email: 'tomas.gomez@wolox.com.ar',
    password: '12345678a'
  },

  someAdministratorUser: {
    firstName: 'Matias',
    lastName: 'Perez',
    email: 'matias.perez@wolox.com.ar',
    password: '12345678a',
    permission: enums.PERMISSION.ADMINISTRATOR
  }
};
