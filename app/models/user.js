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

  User.prototype.printAfterCreationMessage = function printAfterCreationMessage() {
    console.log(`${this.firstName}´s user has been created`);
  };

  return User;
};
