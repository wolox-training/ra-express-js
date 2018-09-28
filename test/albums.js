const chai = require('chai'),
  dictum = require('dictum.js'),
  nock = require('../node_modules/nock'),
  config = require('../config'),
  albumsMocker = require('./mockers/albums'),
  server = require('./../app'),
  generics = require('./generics'),
  { User } = require('../app/models');

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
});
