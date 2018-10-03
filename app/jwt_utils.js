const jwt = require('jsonwebtoken'),
  config = require('../config'),
  errors = require('./errors'),
  enums = require('./enums');

exports.verifyToken = token => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.common.session.secret, (err, decoded) => {
      if (err) return reject(errors.defaultError(err.message));

      resolve();
    });
  });
};

exports.generateToken = user => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { id: user.id, email: user.email, permission: user.permission },
      config.common.session.secret,
      (err, token) => {
        if (err) return reject(errors.defaultError(err.message));

        resolve(token);
      }
    );
  });
};

exports.verifyAdministratorToken = token => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.common.session.secret, (err, decoded) => {
      if (err) return reject(errors.defaultError(err.message));

      if (decoded.permission !== enums.PERMISSION.ADMINISTRATOR) {
        return reject(errors.noAdministratorPermission);
      }

      resolve();
    });
  });
};
