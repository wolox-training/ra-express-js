'use strict';

const bcrypt = require('../../node_modules/bcryptjs');
const logger = require('../logger');

const saltRounds = 10;

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false }
  });
  User.associate = function(models) {
    // associations can be defined here
  };

  User.beforeCreate((user, options) => {
    return bcrypt.hash(user.password, saltRounds).then(hash => {
      user.password = hash;
    });
  });

  User.prototype.printAfterCreationMessage = function printAfterCreationMessage() {
    logger.info(`${this.firstName}´s user has been created`);
  };

  return User;
};
