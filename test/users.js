const chai = require('chai'),
  dictum = require('dictum.js'),
  server = require('./../app'),
  { User } = require('../app/models');

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
        return User.find({
          where: {
            firstName: 'Rodrigo',
            lastName: 'Aparicio',
            email: 'rodrigo.aparicio@wolox.com.ar'
          }
        }).then(user => {
          chai.expect(user).to.be.a('object');
          chai.expect(user.password).to.not.equal('12345678a');
          chai.expect(user.password).to.be.a('string');
          dictum.chai(res, 'a new user is created with the parameters sent');
        });
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
        chai.expect(err.response.body.internal_code).to.equal('invalid_user_password');
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
        chai.expect(err.response.body.internal_code).to.equal('invalid_user_password');
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
        chai.expect(err.response.body.internal_code).to.equal('invalid_user_parameters');
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
        chai.expect(err.response.body.internal_code).to.equal('invalid_user_parameters');
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
        chai.expect(err.response.body.internal_code).to.equal('invalid_user_parameters');
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
        chai.expect(err.response.body.internal_code).to.equal('invalid_user_parameters');
      });
  });

  it('should fail sign up, email is already in use', () => {
    // The first user is created manually using the model to not depend on the
    // implementation
    return User.create({
      firstName: 'Rodrigo',
      lastName: 'Aparicio',
      email: 'rodrigo.aparicio@wolox.com.ar',
      password: '12345678a'
    })
      .then(user => {
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
        chai.expect(err.response.body.internal_code).to.equal('email_already_in_use');
      });
  });
});

describe('/users/sessions POST', () => {
  it('should pass sign in, parameters are correct', () => {
    return User.create({
      firstName: 'Rodrigo',
      lastName: 'Aparicio',
      email: 'rodrigo.aparicio@wolox.com.ar',
      password: '12345678a'
    })
      .then(user => {
        return chai
          .request(server)
          .post('/users/sessions')
          .send({
            email: 'rodrigo.aparicio@wolox.com.ar',
            password: '12345678a'
          });
      })
      .then(res => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.have.property('token');
        chai.expect(res.body.token).to.be.a('string');
        dictum.chai(res, 'the user sent now is logged in');
      });
  });

  it('should fail sign in, missing password parameter', () => {
    return chai
      .request(server)
      .post('/users/sessions')
      .send({
        email: 'rodrigo.aparicio@wolox.com.ar'
      })
      .catch(err => {
        err.should.have.status(400);
        err.response.should.be.json;
        err.response.body.should.have.property('message');
        err.response.body.should.have.property('internal_code');
        chai.expect(err.response.body.internal_code).to.equal('invalid_parameters');
      });
  });

  it('should fail sign in, missing email parameter', () => {
    return chai
      .request(server)
      .post('/users/sessions')
      .send({
        password: '12345678a'
      })
      .catch(err => {
        err.should.have.status(400);
        err.response.should.be.json;
        err.response.body.should.have.property('message');
        err.response.body.should.have.property('internal_code');
        chai.expect(err.response.body.internal_code).to.equal('invalid_parameters');
      });
  });

  it('should fail sign in, email is invalid', () => {
    return chai
      .request(server)
      .post('/users/sessions')
      .send({
        email: 'rodrigo.aparicio@yahoo.com.ar',
        password: '12345678a'
      })
      .catch(err => {
        err.should.have.status(400);
        err.response.should.be.json;
        err.response.body.should.have.property('message');
        err.response.body.should.have.property('internal_code');
        chai.expect(err.response.body.internal_code).to.equal('invalid_user_email');
      });
  });

  it('should fail sign in, email does not match any account', () => {
    return chai
      .request(server)
      .post('/users/sessions')
      .send({
        email: 'rodrigo.aparicio@wolox.com.ar',
        password: '12345678a'
      })
      .catch(err => {
        err.should.have.status(400);
        err.response.should.be.json;
        err.response.body.should.have.property('message');
        err.response.body.should.have.property('internal_code');
        chai.expect(err.response.body.internal_code).to.equal('email_not_match_any_account');
      });
  });

  it('should fail sign in, password is wrong', () => {
    return User.create({
      firstName: 'Rodrigo',
      lastName: 'Aparicio',
      email: 'rodrigo.aparicio@wolox.com.ar',
      password: '12345678a'
    })
      .then(user => {
        return chai
          .request(server)
          .post('/users/sessions')
          .send({
            email: 'rodrigo.aparicio@wolox.com.ar',
            password: 'wrongpassword55'
          });
      })
      .catch(err => {
        err.should.have.status(400);
        err.response.should.be.json;
        err.response.body.should.have.property('message');
        err.response.body.should.have.property('internal_code');
        chai.expect(err.response.body.internal_code).to.equal('wrong_password');
      });
  });
});
