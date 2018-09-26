const chai = require('chai'),
  dictum = require('dictum.js'),
  server = require('./../app'),
  { User } = require('../app/models'),
  jwt = require('jsonwebtoken'),
  enums = require('../app/enums');

chai.should();

const someUser = {
  firstName: 'Federico',
  lastName: 'Diaz',
  email: 'federico.diaz@wolox.com.ar',
  password: '12345678a'
};

const someUser2 = {
  firstName: 'Tomas',
  lastName: 'Gomez',
  email: 'tomas.gomez@wolox.com.ar',
  password: '12345678a'
};

const someAdministratorUser = {
  firstName: 'Matias',
  lastName: 'Perez',
  email: 'matias.perez@wolox.com.ar',
  password: '12345678a',
  permission: enums.PERMISSION.ADMINISTRATOR
};

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
        chai.expect(err.response.body.internal_code).to.equal('invalid_parameters');
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
        chai.expect(err.response.body.internal_code).to.equal('invalid_parameters');
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
        chai.expect(err.response.body.internal_code).to.equal('invalid_parameters');
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
        chai.expect(err.response.body.internal_code).to.equal('invalid_parameters');
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
    return User.create(someUser)
      .then(user => {
        return User.create(someUser2);
      })
      .then(user => {
        // The sign in is manually to no depend on the Sign In endpoint
        // implementation
        return new Promise((resolve, reject) => {
          return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_KEY, (err, token) => {
            return resolve(token);
          });
        });
      })
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
    return User.create(someUser)
      .then(user => {
        return User.create(someUser2);
      })
      .then(user => {
        // The sign in is manually to no depend on the Sign In endpoint
        // implementation
        return new Promise((resolve, reject) => {
          return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_KEY, (err, token) => {
            return resolve(token);
          });
        });
      })
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
});

describe('/admin/users POST', () => {
  it('should pass creating administrator user, administrator token is provided and parameters are valid', () => {
    // The users is created manually using the model to not depend on the
    // Sign Up endpoint implementation
    return User.create(someAdministratorUser)
      .then(user => {
        // The sign in is manually to no depend on the Sign In endpoint
        // implementation
        return new Promise((resolve, reject) => {
          return jwt.sign(
            { id: user.id, email: user.email, permission: user.permission },
            process.env.JWT_KEY,
            (err, token) => {
              return resolve(token);
            }
          );
        });
      })
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
    return User.create(someUser)
      .then(regularUser => {
        return User.create(someAdministratorUser);
      })
      .then(administratorUser => {
        // The sign in is manually to no depend on the Sign In endpoint
        // implementation
        return new Promise((resolve, reject) => {
          return jwt.sign(
            {
              id: administratorUser.id,
              email: administratorUser.email,
              permission: administratorUser.permission
            },
            process.env.JWT_KEY,
            (err, token) => {
              return resolve(token);
            }
          );
        });
      })
      .then(token => {
        return chai
          .request(server)
          .post('/admin/users')
          .send({
            token,
            firstName: someUser.firstName,
            lastName: someUser.lastName,
            email: someUser.email,
            password: someUser.password
          });
      })
      .then(res => {
        res.should.have.status(200);
        return User.find({
          where: {
            firstName: someUser.firstName,
            lastName: someUser.lastName,
            email: someUser.email
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
      .send(someUser)
      .catch(err => {
        err.should.have.status(403);
        err.response.should.be.json;
        err.response.body.should.have.property('message');
        err.response.body.should.have.property('internal_code');
        chai.expect(err.response.body.internal_code).to.equal('no_token_provided');
      });
  });

  it('should fail creating administrator user, no administrator token is provided', () => {
    return User.create(someUser)
      .then(regularUser => {
        // The sign in is manually to no depend on the Sign In endpoint
        // implementation
        return new Promise((resolve, reject) => {
          return jwt.sign(
            {
              id: regularUser.id,
              email: regularUser.email,
              permission: regularUser.permission
            },
            process.env.JWT_KEY,
            (err, token) => {
              return resolve(token);
            }
          );
        });
      })
      .then(token => {
        return chai
          .request(server)
          .post('/admin/users')
          .send({ token }, someUser2);
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
