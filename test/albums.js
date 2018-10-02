const chai = require('chai'),
  dictum = require('dictum.js'),
  nock = require('../node_modules/nock'),
  config = require('../config'),
  albumsMocker = require('./mockers/albums'),
  server = require('./../app'),
  generics = require('./generics'),
  { User } = require('../app/models'),
  { Album } = require('../app/models');

chai.should();

describe('/albums GET', () => {
  beforeEach(() => {
    nock(config.common.albumsApi.uri)
      .get('')
      .reply(200, albumsMocker.albums);
  });
  it('should get all albums, token is provided', () => {
    return User.create(generics.someUser)
      .then(generics.signIn)
      .then(token => {
        return chai
          .request(server)
          .get('/albums')
          .send({ token });
      })
      .then(res => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.have.property('albums');
        chai.expect(res.body.albums).to.be.a('array');
        chai.expect(res.body.albums.length).to.equal(albumsMocker.albums.length);
        const [album] = res.body.albums;
        album.should.have.property('userId');
        album.should.have.property('id');
        album.should.have.property('title' || 'tittle');
        dictum.chai(res, 'all albums were obtained');
      });
  });

  it('should not get albums, no token is provided', () => {
    return User.create(generics.someUser)
      .then(() => {
        return chai.request(server).get('/albums');
      })
      .catch(err => {
        err.should.have.status(403);
        err.response.should.be.json;
        err.response.body.should.have.property('message');
        err.response.body.should.have.property('internal_code');
        chai.expect(err.response.body.internal_code).to.equal('no_token_provided');
      });
  });
});

describe('/albums/:id POST', () => {
  it('should buy album, album is available and token is provided', () => {
    const [mockedAlbum] = albumsMocker.albums;

    return User.create(generics.someUser)
      .then(generics.signIn)
      .then(token => {
        nock(`${config.common.albumsApi.uri}/${mockedAlbum.id}`)
          .get('')
          .reply(200, mockedAlbum);

        return chai
          .request(server)
          .post(`/albums/${mockedAlbum.id}`)
          .send({ token });
      })
      .then(res => {
        res.should.have.status(200);
        return Album.find({
          where: mockedAlbum
        }).then(album => {
          // Search for the user id in order to compare it with album.userId
          const userFilter = {
            firstName: generics.someUser.firstName,
            lastName: generics.someUser.lastName,
            email: generics.someUser.email
          };

          return User.find({
            where: userFilter
          }).then(user => {
            chai.expect(album).to.be.a('object');
            chai.expect(album.id).to.equal(mockedAlbum.id);
            chai.expect(album.userId).to.equal(user.id);
            chai.expect(album.title).to.equal(mockedAlbum.title);
            dictum.chai(res, 'a new album is saved with the user who bought it');
          });
        });
      });
  });
});
