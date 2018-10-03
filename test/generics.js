const enums = require('../app/enums'),
  { User } = require('../app/models'),
  jwtUtils = require('../app/jwt_utils');

const someUser = {
  firstName: 'Federico',
  lastName: 'Diaz',
  email: 'federico.diaz@wolox.com.ar',
  password: '12345678a'
};

const someAdministratorUser = {
  firstName: 'Matias',
  lastName: 'Perez',
  email: 'matias.perez@wolox.com.ar',
  password: '12345678a',
  permission: enums.PERMISSION.ADMINISTRATOR
};

const someUser2 = {
  firstName: 'Tomas',
  lastName: 'Gomez',
  email: 'tomas.gomez@wolox.com.ar',
  password: '12345678a'
};

module.exports = {
  someUser,
  someUser2,
  someAdministratorUser,

  createUserAndGenerateToken: userType => {
    let user;

    switch (userType) {
      case enums.PERMISSION.REGULAR:
        user = someUser2;
        break;
      case enums.PERMISSION.ADMINISTRATOR:
        user = someAdministratorUser;
        break;
    }

    return User.create(user).then(jwtUtils.generateToken);
  }
};
