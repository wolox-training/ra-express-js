const enums = require('../app/enums'),
  { User } = require('../app/models'),
  jwtUtils = require('../app/jwt_utils');

const defaultAdministratorUserForCreation = {
  firstName: 'Matias',
  lastName: 'Perez',
  email: 'matias.perez@wolox.com.ar',
  password: '12345678a',
  permission: enums.PERMISSION.ADMINISTRATOR
};

const defaultRegularUserForCreation = {
  firstName: 'Tomas',
  lastName: 'Gomez',
  email: 'tomas.gomez@wolox.com.ar',
  password: '12345678a'
};

module.exports = {
  someUser: {
    firstName: 'Federico',
    lastName: 'Diaz',
    email: 'federico.diaz@wolox.com.ar',
    password: '12345678a'
  },

  createUserAndGenerateToken: userType => {
    let user;

    switch (userType) {
      case enums.PERMISSION.REGULAR:
        user = defaultRegularUserForCreation;
        break;
      case enums.PERMISSION.ADMINISTRATOR:
        user = defaultAdministratorUserForCreation;
        break;
    }

    return User.create(user).then(jwtUtils.generateToken);
  },

  defaultRegularUserForCreation,
  defaultAdministratorUserForCreation
};
