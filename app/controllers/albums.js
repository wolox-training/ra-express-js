const albumService = require('../services/albums');

exports.getAllAlbums = (req, res, next) => {
  albumService
    .getAllAlbums()
    .then(response => res.status(200).json({ albums: response }))
    .catch(next);
};
