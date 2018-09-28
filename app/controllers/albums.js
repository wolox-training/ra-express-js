const albumService = require('../services/albums'),
  errors = require('../errors'),
  logger = require('../logger'),
  config = require('../../config');

exports.getAllAlbums = (req, res, next) => {
  albumService.getAllAlbums().then(response => res.status(200).json(response));
};
