const { User } = require('../models/'),
  errors = require('../errors');

exports.getUserByEmail = email => {
  return User.findOne({
    where: {
      email
    }
  }).catch(error => {
    throw errors.databaseError(error.message);
  });
};

exports.createUser = userParameters => {
  return User.create({
    firstName: userParameters.firstName,
    lastName: userParameters.lastName,
    email: userParameters.email,
    password: userParameters.password
  }).catch(error => {
    throw errors.databaseError(error.message);
  });
};
