'use strict';

const bcrypt = require('../../node_modules/bcryptjs');

const saltRounds = 10;
const validEmailPattern = /^[a-zA-Z0-9_.+-]+@wolox\.com\.ar$/g;
const validPasswordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/g;

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

  User.obligatoryParametersWereReceived = function(parameters) {
    return (
      parameters.includes('firstName') &&
      parameters.includes('lastName') &&
      parameters.includes('email') &&
      parameters.includes('password')
    );
  };

  User.emailIsValid = function(email) {
    return email.match(validEmailPattern);
  };

  User.passwordIsValid = function(password) {
    return password.match(validPasswordPattern);
  };

  User.emailIsAvailable = function(email) {
    return this.findOne({
      where: {
        email
      }
    }).then(user => {
      if (user) return Promise.resolve(false);
      return Promise.resolve(true);
    });
  };

  User.prototype.printAfterCreationMessage = function printAfterCreationMessage() {
    console.log(`${this.firstName}´s user has been created`);
  };

  return User;
};
