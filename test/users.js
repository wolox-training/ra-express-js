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
        dictum.chai(res, 'a new user is created with the parametes sent');
      });
  });
});
