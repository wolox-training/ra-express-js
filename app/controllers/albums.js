const albumService = require('../services/albums');

exports.getAllAlbums = (req, res, next) => {
  albumService
    .getAllAlbums()
    .then(albums => res.json({ albums }))
    .catch(next);
};
