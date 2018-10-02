const albumService = require('../services/albums'),
  errors = require('../errors');

exports.getAllAlbums = (req, res, next) => {
  albumService
    .getAllAlbums()
    .then(response => res.json({ albums: response }))
    .catch(next);
};

exports.buyAlbum = (req, res, next) => {
  albumService
    .getAlbumById(req.params.id)
    .then(album => {
      if (!album) throw errors.albumNotExists;

      const filter = {
        id: req.params.id
      };

      return albumService
        .getLocalAlbumsByFilter(filter)
        .then(albums => {
          const [localAlbum] = albums;

          if (localAlbum && localAlbum.userId === req.body.userId) throw errors.userAlreadyHasTheAlbum;

          if (localAlbum) throw errors.albumAlreadyHasOwnerUser;

          // The album is not in the database, so now it is saved
          return albumService.createAlbum(album);
        })
        .then(() => res.sendStatus(200));
    })
    .catch(next);
};
