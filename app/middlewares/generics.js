const logger = require('../logger'),
  jwt = require('jsonwebtoken'),
  errors = require('../errors'),
  enums = require('../enums'),
  config = require('../../config');

exports.logRequestInformation = (req, res, next) => {
  logger.info(`A new request received at ${new Date()}`);
  logger.info('Request URL:', req.originalUrl);
  logger.info('Request Type:', req.method);
  next();
};

exports.verifyToken = (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers[config.common.session.header_name];

  if (token) {
    return jwt.verify(token, config.common.session.secret, (err, decoded) => {
      if (err) return next(errors.defaultError(err.message));

      return next();
    });
  }

  return next(errors.noTokenProvided);
};

exports.verifyAdministratorToken = (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers[config.common.session.header_name];

  if (token) {
    return jwt.verify(token, config.common.session.secret, (err, decoded) => {
      if (err) return next(errors.defaultError(err.message));

      if (decoded.permission !== enums.PERMISSION.ADMINISTRATOR)
        return next(errors.noAdministratorPermission);

      return next();
    });
  }

  return next(errors.noTokenProvided);
};
