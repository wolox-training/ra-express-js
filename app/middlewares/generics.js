const logger = require('../logger'),
  jwt = require('jsonwebtoken'),
  errors = require('../errors');

exports.logRequestInformation = (req, res, next) => {
  logger.info(`A new request received at ${new Date()}`);
  logger.info('Request URL:', req.originalUrl);
  logger.info('Request Type:', req.method);
  next();
};

exports.verifyToken = (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers['x-access-token'];

  if (token) {
    return jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
      if (err) return next(errors.defaultError(err.message));

      return next();
    });
  }

  return next(errors.noTokenProvided);
};
