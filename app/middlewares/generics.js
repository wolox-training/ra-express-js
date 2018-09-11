const logger = require('../logger');

exports.logRequestInformation = (req, res, next) => {
  logger.info(`A new request received at ${new Date()}`);
  logger.info('Request URL:', req.originalUrl);
  logger.info('Request Type:', req.method);
  next();
};

exports.success = (req, res) => res.sendStatus(200);
