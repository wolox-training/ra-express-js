const User = require('../models/').User,
  errors = require('../errors');

exports.emailIsAvailable = email => {
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
