const chai = require('chai'),
  dictum = require('dictum.js'),
  server = require('./../app');

chai.should();

describe('/users POST', () => {
  it('should pass sign up, parameters are valid', () => {
    return chai
      .request(server)
      .post('/users')
      .send({
        firstName: 'Rodrigo',
        lastName: 'Aparicio',
        email: 'rodrigo.aparicio@wolox.com.ar',
        password: '12345678a'
      })
      .then(res => {
        res.should.have.status(200);
        dictum.chai(res, 'a new user is created with the parameters sent');
      });
  });

  it('should fail sign up, password is invalid has no numbers', () => {
    return chai
      .request(server)
      .post('/users')
      .send({
        firstName: 'Rodrigo',
        lastName: 'Aparicio',
        email: 'rodrigo.aparicio@wolox.com.ar',
        password: 'helloworld'
      })
      .catch(err => {
        err.should.have.status(400);
        err.response.should.be.json;
        err.response.body.should.have.property('message');
        err.response.body.should.have.property('internal_code');
      });
  });

  it('should fail sign up, password is invalid has less than 8 characters', () => {
    return chai
      .request(server)
      .post('/users')
      .send({
        firstName: 'Rodrigo',
        lastName: 'Aparicio',
        email: 'rodrigo.aparicio@wolox.com.ar',
        password: 'hi123'
      })
      .catch(err => {
        err.should.have.status(400);
        err.response.should.be.json;
        err.response.body.should.have.property('message');
        err.response.body.should.have.property('internal_code');
      });
  });

  it('should fail sign up, missing firstName parameter', () => {
    return chai
      .request(server)
      .post('/users')
      .send({
        lastName: 'Aparicio',
        email: 'rodrigo.aparicio@wolox.com.ar',
        password: 'hi123'
      })
      .catch(err => {
        err.should.have.status(400);
        err.response.should.be.json;
        err.response.body.should.have.property('message');
        err.response.body.should.have.property('internal_code');
      });
  });

  it('should fail sign up, missing lastName parameter', () => {
    return chai
      .request(server)
      .post('/users')
      .send({
        firstName: 'Rodrigo',
        email: 'rodrigo.aparicio@wolox.com.ar',
        password: 'hi123'
      })
      .catch(err => {
        err.should.have.status(400);
        err.response.should.be.json;
        err.response.body.should.have.property('message');
        err.response.body.should.have.property('internal_code');
      });
  });

  it('should fail sign up, missing email parameter', () => {
    return chai
      .request(server)
      .post('/users')
      .send({
        firstName: 'Rodrigo',
        lastName: 'Aparicio',
        password: 'hi123'
      })
      .catch(err => {
        err.should.have.status(400);
        err.response.should.be.json;
        err.response.body.should.have.property('message');
        err.response.body.should.have.property('internal_code');
      });
  });

  it('should fail sign up, missing password parameter', () => {
    return chai
      .request(server)
      .post('/users')
      .send({
        firstName: 'Rodrigo',
        lastName: 'Aparicio',
        email: 'rodrigo.aparicio@wolox.com.ar'
      })
      .catch(err => {
        err.should.have.status(400);
        err.response.should.be.json;
        err.response.body.should.have.property('message');
        err.response.body.should.have.property('internal_code');
      });
  });

  it('should fail sign up, email is already in use', () => {
    return chai
      .request(server)
      .post('/users')
      .send({
        firstName: 'Rodrigo',
        lastName: 'Aparicio',
        email: 'rodrigo.aparicio@wolox.com.ar',
        password: '12345678a'
      })
      .then(res => {
        return chai
          .request(server)
          .post('/users')
          .send({
            firstName: 'OtherRodrigo',
            lastName: 'OtherAparicio',
            email: 'rodrigo.aparicio@wolox.com.ar',
            password: '12345678a'
          });
      })
      .catch(err => {
        err.should.have.status(400);
        err.response.should.be.json;
        err.response.body.should.have.property('message');
        err.response.body.should.have.property('internal_code');
      });
  });
});
