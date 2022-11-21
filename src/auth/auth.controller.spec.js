import supertest from 'supertest';
import { app } from '../app.js';
import { sequelize } from '../common/database.config.js';
import { UserModel } from '../user/user.model.js';
import { users } from '../user/user.database-mock.js';

beforeAll(async () => {
  await sequelize.sync();
  await UserModel.destroy({ truncate: true, restartIdentity: true });
  for (const user of users) {
    await UserModel.create({
      login: user.login,
      pwd: user.pwd,
      role: user.role,
    });
  }
});

describe('POST /auth/login', () => {
  const credentials = { username: 'user', password: 'pwd' };

  it('should send a success response', done => {
    supertest(app)
      .post('/auth/login')
      .set('content-type', 'application/json')
      .send(credentials)
      .then(response => {
        expect(response.status).toBe(201);
      })
      .then(done)
      .catch(done);
  });

  it('should send a response with token', done => {
    supertest(app)
      .post('/auth/login')
      .set('content-type', 'application/json')
      .send(credentials)
      .then(response => {
        expect(response.body.token).toBeDefined();
        expect(typeof response.body.token).toBe('string');
      })
      .then(done)
      .catch(done);
  });

  it('should send an error response because of missing credentials', done => {
    supertest(app)
      .post('/auth/login')
      .set('content-type', 'application/json')
      .then(response => {
        expect(response.status).toBe(401);
      })
      .then(done)
      .catch(done);
  });

  it('should send an error response because of bad user name', done => {
    supertest(app)
      .post('/auth/login')
      .set('content-type', 'application/json')
      .send(({ ...credentials, username: 'toto' }))
      .then(response => {
        expect(response.status).toBe(401);
      })
      .then(done)
      .catch(done);
  });

  it('should send an error response because of bad password', done => {
    supertest(app)
      .post('/auth/login')
      .set('content-type', 'application/json')
      .send(({ ...credentials, password: 'toto' }))
      .then(response => {
        expect(response.status).toBe(401);
      })
      .then(done)
      .catch(done);
  });
});
