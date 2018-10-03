const { User } = require('../models/'),
  errors = require('../errors'),
  bcrypt = require('../../node_modules/bcryptjs');

exports.createUser = userParameters => {
  return User.create({
    firstName: userParameters.firstName,
    lastName: userParameters.lastName,
    email: userParameters.email,
    password: userParameters.password,
    permission: userParameters.permission
  }).catch(error => {
    throw errors.databaseError(error.message);
  });
};

exports.userPasswordMatch = (plainPassword, hashedPassword) => bcrypt.compare(plainPassword, hashedPassword);

exports.getAllUsersWithPagination = (limit, offset) => {
  return User.findAndCountAll({
    attributes: ['firstName', 'lastName', 'email'],
    offset,
    limit
  }).catch(error => {
    throw errors.databaseError(error.message);
  });
};

exports.getUsersByFilter = filter => {
  return User.findAll({
    where: filter
  }).catch(error => {
    throw errors.databaseError(error.message);
  });
};

exports.getUserByEmail = email => {
  return User.findOne({
    where: {
      email
    }
  }).catch(error => {
    throw errors.databaseError(error.message);
  });
};
