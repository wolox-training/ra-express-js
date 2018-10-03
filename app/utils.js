const jwt = require('jsonwebtoken'),
  config = require('../config'),
  errors = require('../app/errors');

exports.verifyToken = token => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.common.session.secret, (err, decoded) => {
      if (err) return reject(errors.defaultError(err.message));

      resolve();
    });
  });
};
