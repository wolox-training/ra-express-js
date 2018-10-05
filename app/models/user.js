'use strict';

const bcrypt = require('bcryptjs'),
  errors = require('../errors');

const saltRounds = 10;

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    permission: {
      type: DataTypes.ENUM('regular', 'administrator'),
      allowNull: false,
      defaultValue: 'regular'
    }
  });
  User.associate = function(models) {
    // associations can be defined here
  };

  User.beforeCreate((user, options) => {
    return bcrypt
      .hash(user.password, saltRounds)
      .then(hash => {
        user.password = hash;
      })
      .catch(error => {
        throw errors.defaultError(error.message);
      });
  });

  User.getAfterCreationMessage = user => `${user.firstName}´s user has been created`;

  User.getAfterLoggingInMessage = user => `${user.firstName}´s user has logged in correctly`;

  return User;
};
