const chai = require('chai'),
  dictum = require('dictum.js'),
  server = require('./../app'),
  { User } = require('../app/models'),
  enums = require('../app/enums'),
  generics = require('./generics');

chai.should();

describe('/users POST', () => {
  it('should pass sign up, parameters are valid', () => {
    let response;

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
        response = res;
        return User.find({
          where: {
            firstName: 'Rodrigo',
            lastName: 'Aparicio',
            email: 'rodrigo.aparicio@wolox.com.ar'
          }
        });
      })
      .then(user => {
        chai.expect(user).to.be.a('object');
        chai.expect(user.password).to.not.equal('12345678a');
        chai.expect(user.password).to.be.a('string');
        dictum.chai(response, 'a new user is created with the parameters sent');
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
        chai.expect(err.response.body.internal_code).to.equal('missing_parameters');
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
        chai.expect(err.response.body.internal_code).to.equal('missing_parameters');
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
        chai.expect(err.response.body.internal_code).to.equal('missing_parameters');
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
        chai.expect(err.response.body.internal_code).to.equal('missing_parameters');
      });
  });

  it('should fail sign up, email is already in use', () => {
    // The first user is created manually using the model to not depend on the
    // Sign Up endpoint implementation
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
    // The user is created manually using the model to not depend on the
    // Sign Up endpoint implementation
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
        chai.expect(err.response.body.internal_code).to.equal('missing_parameters');
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
        chai.expect(err.response.body.internal_code).to.equal('missing_parameters');
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
    // The user is created manually using the model to not depend on the
    // Sign Up endpoint implementation
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

describe('/users GET', () => {
  it('should pass getting users, token is provided', () => {
    const page = 1;

    // The users are created manually using the model to not depend on the
    // Sign Up endpoint implementation
    return User.create(generics.someUser)
      .then(user => {
        return User.create(generics.someUser2);
      })
      .then(generics.signIn)
      .then(token => {
        return chai
          .request(server)
          .get('/users')
          .query({ page })
          .send({
            token
          });
      })
      .then(res => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.have.property('users');
        res.body.should.have.property('count');
        res.body.should.have.property('pages');
        chai.expect(res.body.users).to.be.a('array');
        chai.expect(res.body.count).to.be.a('number');
        chai.expect(res.body.pages).to.be.a('number');
        chai.expect(res.body.count).to.equal(2);
        dictum.chai(res, 'the users of the page requested now are in the response');
      });
  });

  it('should fail getting users, no token is provided', () => {
    const page = 1;

    return chai
      .request(server)
      .get('/users')
      .query({ page })
      .catch(err => {
        err.should.have.status(403);
        err.response.should.be.json;
        err.response.body.should.have.property('message');
        err.response.body.should.have.property('internal_code');
        chai.expect(err.response.body.internal_code).to.equal('no_token_provided');
      });
  });

  it('should no get users, page number is too big', () => {
    const page = 1000;

    // The users are created manually using the model to not depend on the
    // Sign Up endpoint implementation
    return User.create(generics.someUser)
      .then(user => {
        return User.create(generics.someUser2);
      })
      .then(generics.signIn)
      .then(token => {
        return chai
          .request(server)
          .get('/users')
          .query({ page })
          .send({
            token
          });
      })
      .then(res => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.have.property('users');
        res.body.should.have.property('count');
        res.body.should.have.property('pages');
        chai.expect(res.body.users).to.be.a('array');
        chai.expect(res.body.count).to.be.a('number');
        chai.expect(res.body.pages).to.be.a('number');
        chai.expect(res.body.count).to.equal(2);
        chai.expect(res.body.users.length).to.equal(0);
      });
  });

  it('should fail getting users, missing page', () => {
    return User.create(generics.someUser)
      .then(generics.signIn)
      .then(token => {
        return chai
          .request(server)
          .get('/users')
          .send({
            token
          });
      })
      .catch(err => {
        err.should.have.status(400);
        err.response.should.be.json;
        err.response.body.should.have.property('message');
        err.response.body.should.have.property('internal_code');
        chai.expect(err.response.body.internal_code).to.equal('missing_parameters');
      });
  });

  it('should fail getting users, missing page (is not an integer)', () => {
    const page = 'hi';

    return User.create(generics.someUser)
      .then(generics.signIn)
      .then(token => {
        return chai
          .request(server)
          .get('/users')
          .query({ page })
          .send({
            token
          });
      })
      .catch(err => {
        err.should.have.status(400);
        err.response.should.be.json;
        err.response.body.should.have.property('message');
        err.response.body.should.have.property('internal_code');
        chai.expect(err.response.body.internal_code).to.equal('missing_parameters');
      });
  });
});

describe('/admin/users POST', () => {
  it('should pass creating administrator user, administrator token is provided and parameters are valid', () => {
    // The users is created manually using the model to not depend on the
    // Sign Up endpoint implementation
    return User.create(generics.someAdministratorUser)
      .then(generics.signIn)
      .then(token => {
        return chai
          .request(server)
          .post('/admin/users')
          .send({
            token,
            firstName: 'Rodrigo',
            lastName: 'Aparicio',
            email: 'rodrigo.aparicio@wolox.com.ar',
            password: '12345678a'
          });
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
          chai.expect(user.permission).to.equal(enums.PERMISSION.ADMINISTRATOR);
          dictum.chai(res, 'a new user with administrator permission is created with the parameters sent');
        });
      });
  });

  it('should pass updating regular to administrator user, administrator token is provided and parameters are valid', () => {
    // The users are created manually using the model to not depend on the
    // Sign Up endpoint implementation
    return User.create(generics.someUser)
      .then(regularUser => {
        return User.create(generics.someAdministratorUser);
      })
      .then(generics.signIn)
      .then(token => {
        return chai
          .request(server)
          .post('/admin/users')
          .send({
            token,
            firstName: generics.someUser.firstName,
            lastName: generics.someUser.lastName,
            email: generics.someUser.email,
            password: generics.someUser.password
          });
      })
      .then(res => {
        res.should.have.status(200);
        return User.find({
          where: {
            firstName: generics.someUser.firstName,
            lastName: generics.someUser.lastName,
            email: generics.someUser.email
          }
        }).then(user => {
          chai.expect(user).to.be.a('object');
          chai.expect(user.permission).to.equal(enums.PERMISSION.ADMINISTRATOR);
          dictum.chai(res, 'an user with regular permission now has administrator permission');
        });
      });
  });

  it('should fail creating administrator user, no token is provided', () => {
    return chai
      .request(server)
      .post('/admin/users')
      .send(generics.someUser)
      .catch(err => {
        err.should.have.status(403);
        err.response.should.be.json;
        err.response.body.should.have.property('message');
        err.response.body.should.have.property('internal_code');
        chai.expect(err.response.body.internal_code).to.equal('no_token_provided');
      });
  });

  it('should fail creating administrator user, no administrator token is provided', () => {
    return User.create(generics.someUser)
      .then(generics.signIn)
      .then(token => {
        return chai
          .request(server)
          .post('/admin/users')
          .send({ token }, generics.someUser2);
      })
      .catch(err => {
        err.should.have.status(403);
        err.response.should.be.json;
        err.response.body.should.have.property('message');
        err.response.body.should.have.property('internal_code');
        chai.expect(err.response.body.internal_code).to.equal('no_administrator_permission');
      });
  });
});
