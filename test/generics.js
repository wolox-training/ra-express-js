const enums = require('../app/enums');

module.exports = {
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
