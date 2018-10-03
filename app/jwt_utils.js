const jwt = require('jsonwebtoken'),
  config = require('../config'),
  errors = require('./errors');

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
    jwt.sign({ id: user.id, email: user.email }, config.common.session.secret, (err, token) => {
      if (err) return reject(errors.defaultError(err.message));

      resolve(token);
    });
  });
};
