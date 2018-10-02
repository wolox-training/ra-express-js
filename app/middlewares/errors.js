const errors = require('../errors'),
  logger = require('../logger');

const DEFAULT_STATUS_CODE = 500;

const statusCodes = {
  [errors.MISSING_PARAMETERS]: 400,
  [errors.INVALID_USER_EMAIL]: 400,
  [errors.INVALID_USER_PASSWORD]: 400,
  [errors.EMAIL_ALREADY_IN_USE]: 400,
  [errors.EMAIL_NOT_MATCH_ANY_ACCOUNT]: 400,
  [errors.WRONG_PASSWORD]: 400,
  [errors.ALBUM_ALREADY_HAS_OWNER_USER]: 400,
  [errors.USER_ALREADY_HAS_THE_ALBUM]: 400,
  [errors.ALBUM_NOT_EXISTS]: 400,
  [errors.NO_TOKEN_PROVIDED]: 403,
  [errors.NO_ADMINISTRATOR_PERMISSION]: 403,
  [errors.BOOK_NOT_FOUND]: 404,
  [errors.SAVING_ERROR]: 400,
  [errors.DATABASE_ERROR]: 503,
  [errors.DEFAULT_ERROR]: 500,
  [errors.ALBUMS_API_ERROR]: 503
};

exports.handle = (error, req, res, next) => {
  if (error.internalCode) {
    res.status(statusCodes[error.internalCode] || DEFAULT_STATUS_CODE);
  } else {
    // Unrecognized error, notifying it to rollbar.
    next(error);
    res.status(DEFAULT_STATUS_CODE);
  }
  logger.error(error);
  return res.send({ message: error.message, internal_code: error.internalCode });
};
