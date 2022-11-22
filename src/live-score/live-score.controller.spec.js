import supertest from 'supertest';
import { app } from '../app.js';
import { liveScores } from './live-score.mock.js';
import { LiveScoreModel } from './live-score.model.js';
import { sequelize } from '../common/database.config.js';
import { users } from '../user/user.database-mock.js';
import { UserModel } from '../user/user.model.js';

const nonExistentId = 100;
const existingIds = [];
const securityHeaders = [
  'content-security-policy',
  'cross-origin-embedder-policy',
  'cross-origin-opener-policy',
  'cross-origin-resource-policy',
  'x-dns-prefetch-control',
  'x-frame-options',
  'strict-transport-security',
  'x-download-options',
  'x-content-type-options',
  'origin-agent-cluster',
  'x-permitted-cross-domain-policies',
  'referrer-policy',
  'x-xss-protection',
];

beforeAll(async () => {
  await sequelize.sync();
  await LiveScoreModel.destroy({ truncate: true, restartIdentity: true });
  for (const liveScore of liveScores) {
    const model = await LiveScoreModel.create({
      title: liveScore.title,
      publicationDate: liveScore.publicationDate
    });
    existingIds.push(model.id);
  }
  await UserModel.destroy({ truncate: true, restartIdentity: true });
  for (const user of users) {
    await UserModel.create({
      login: user.login,
      pwd: user.pwd,
      role: user.role,
    });
  }
});

describe('GET /live-scores', () => {
  describe('all', () => {
    it('should send a success response', done => {
      supertest(app)
        .get('/live-scores')
        .then(response => {
          expect(response.status).toBe(200);
        })
        .then(done)
        .catch(done);
    });
    it('should send a response with all the items', done => {
      supertest(app)
        .get('/live-scores')
        .then(response => {
          expect(response.body).toBeInstanceOf(Array);
          expect(response.body.length).toBe(16);
        })
        .then(done)
        .catch(done);
    });
    it('should send a response with all structured items', done => {
      supertest(app)
        .get('/live-scores')
        .then(response => {
          response.body.forEach(item => {
            expect(item).toHaveProperty('id');
            expect(item).toHaveProperty('title');
            expect(item).toHaveProperty('publication');
          });
        })
        .then(done)
        .catch(done);
    });
    it('should send a response with security headers', done => {
      supertest(app)
        .get('/live-scores')
        .then(response => {
          securityHeaders.forEach(headerName => expect(response.headers[headerName]).toBeDefined());
          expect(response.headers['x-powered-by']).not.toBeDefined();
        })
        .then(done)
        .catch(done);
    });
  });

  describe('page', () => {
    it('should send a success response with first page of items', done => {
      supertest(app)
        .get('/live-scores?pageIndex=0&pageSize=5')
        .then(response => {
          expect(response.status).toBe(200);
          expect(response.body).toBeInstanceOf(Array);
          expect(response.body.length).toBe(5);
        })
        .then(done)
        .catch(done);
    });
    it('should send a success response with second page of items', done => {
      supertest(app)
        .get('/live-scores?pageIndex=1&pageSize=5')
        .then(response => {
          expect(response.status).toBe(200);
          expect(response.body).toBeInstanceOf(Array);
          expect(response.body.length).toBe(5);
        })
        .then(done)
        .catch(done);
    });
    it('should send a success response with third page of items', done => {
      supertest(app)
        .get('/live-scores?pageIndex=2&pageSize=5')
        .then(response => {
          expect(response.status).toBe(200);
          expect(response.body).toBeInstanceOf(Array);
          expect(response.body.length).toBe(5);
        })
        .then(done)
        .catch(done);
    });
    it('should send a success response with fourth page of items', done => {
      supertest(app)
        .get('/live-scores?pageIndex=3&pageSize=5')
        .then(response => {
          expect(response.status).toBe(200);
          expect(response.body).toBeInstanceOf(Array);
          expect(response.body.length).toBe(1);
        })
        .then(done)
        .catch(done);
    });
    it('should send a success response with fifth page items', done => {
      supertest(app)
        .get('/live-scores?pageIndex=4&pageSize=5')
        .then(response => {
          expect(response.status).toBe(200);
          expect(response.body).toBeInstanceOf(Array);
          expect(response.body.length).toBe(0);
        })
        .then(done)
        .catch(done);
    });
    it('should send a response with all items count for first page', done => {
      supertest(app)
        .get('/live-scores?pageIndex=0&pageSize=5')
        .then(response => {
          expect(response.headers['x-total-count']).toEqual('16');
        })
        .then(done)
        .catch(done);
    });
    it('should send a response with all items count for second page', done => {
      supertest(app)
        .get('/live-scores?pageIndex=1&pageSize=5')
        .then(response => {
          expect(response.headers['x-total-count']).toEqual('16');
        })
        .then(done)
        .catch(done);
    });
    it('should send a response with all items count for third page', done => {
      supertest(app)
        .get('/live-scores?pageIndex=2&pageSize=5')
        .then(response => {
          expect(response.headers['x-total-count']).toEqual('16');
        })
        .then(done)
        .catch(done);
    });
    it('should send a response with all items count for fourth page', done => {
      supertest(app)
        .get('/live-scores?pageIndex=3&pageSize=5')
        .then(response => {
          expect(response.headers['x-total-count']).toEqual('16');
        })
        .then(done)
        .catch(done);
    });
    it('should send a response with structured items', done => {
      supertest(app)
        .get('/live-scores?pageIndex=0&pageSize=5')
        .then(response => {
          response.body.forEach(item => {
            expect(item).toHaveProperty('id');
            expect(item).toHaveProperty('title');
            expect(item).toHaveProperty('publication');
          });
        })
        .then(done)
        .catch(done);
    });
    it('should send a error response because of not natural page index', done => {
      supertest(app)
        .get('/live-scores?pageIndex=-1&pageSize=5')
        .then(response => {
          expect(response.status).toBe(400);
        })
        .then(done)
        .catch(done);
    });
    it('should send a error response because of page index bad type', done => {
      supertest(app)
        .get('/livescores?pageIndex=xyz&pageSize=5')
        .then(response => {
          expect(response.status).toBe(400);
        })
        .then(done)
        .catch(done);
    });
    it('should send a error response because of negative page size', done => {
      supertest(app)
        .get('/livescores?pageIndex=0&pageSize=-1')
        .then(response => {
          expect(response.status).toBe(400);
        })
        .then(done)
        .catch(done);
    });
    it('should send a error response because of not positive page size', done => {
      supertest(app)
        .get('/livescores?pageIndex=0&pageSize=0')
        .then(response => {
          expect(response.status).toBe(400);
        })
        .then(done)
        .catch(done);
    });
    it('should send a error response because of page size bad type', done => {
      supertest(app)
        .get('/livescores?pageIndex=0&pageSize=xyz')
        .then(response => {
          expect(response.status).toBe(400);
        })
        .then(done)
        .catch(done);
    });
    it('should send a response with security headers', done => {
      supertest(app)
        .get('/livescores?pageIndex=0&pageSize=5')
        .then(response => {
          securityHeaders.forEach(headerName => expect(response.headers[headerName]).toBeDefined());
          expect(response.headers['x-powered-by']).not.toBeDefined();
        })
        .then(done)
        .catch(done);
    });
    it('should send a compressed response', done => {
      supertest(app)
        .get('/livescores?pageIndex=0&pageSize=100')
        .set('accept-encoding', 'gzip')
        .then(response => {
          expect(response.headers['content-encoding']).toBe('gzip');
        })
        .then(done)
        .catch(done);
    });
  });
});

describe('GET /livescores/:id', () => {
  it('should send a success response', done => {
    supertest(app)
      .get(`/livescores/${existingIds[0]}`)
      .then(response => {
        expect(response.status).toBe(200);
      })
      .then(done)
      .catch(done);
  });
  it('should send a response with structured item', done => {
    supertest(app)
      .get(`/livescores/${existingIds[0]}`)
      .then(response => {
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('title');
        expect(response.body).toHaveProperty('publication');
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of negative resource id', done => {
    supertest(app)
      .get('/livescores/-1')
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of not positive resource id', done => {
    supertest(app)
      .get('/livescores/0')
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of resource id bad type', done => {
    supertest(app)
      .get('/livescores/xyz')
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of not found item', done => {
    supertest(app)
      .get(`/livescores/${nonExistentId}`)
      .then(response => {
        expect(response.status).toBe(404);
      })
      .then(done)
      .catch(done);
  });
  it('should send a response with security headers', done => {
    supertest(app)
      .get(`/livescores/${existingIds[0]}`)
      .then(response => {
        securityHeaders.forEach(headerName => expect(response.headers[headerName]).toBeDefined());
        expect(response.headers['x-powered-by']).not.toBeDefined();
      })
      .then(done)
      .catch(done);
  });
});

describe('POST /livescores/', () => {
  const createdItem = { title: 'Nodemon for noobs', publication: '2010-01-01' };
  let createdId;
  let authenticationToken;

  beforeEach(done => {
    createdId = null;

    supertest(app).post('/auth/login')
      .send({ username: 'user', password: 'pwd' })
      .then(response => {
        authenticationToken = response.body.token
      })
      .catch().finally(done);
  });
  afterEach(done => {
    if (createdId) {
      supertest(app).delete(`/livescores/${createdId}`)
        .set('authorization', ['Bearer', authenticationToken].join(' '))
        .then(response => authenticationToken = response.body.token)
        .catch().finally(done);
    } else {
      done();
    }
  });

  it('should send a success response', done => {
    supertest(app)
      .post('/livescores')
      .set('authorization', ['Bearer', authenticationToken].join(' '))
      .set('content-type', 'application/json')
      .send(createdItem)
      .then(response => {
        createdId = response.body.id;
        expect(response.status).toBe(201);
      })
      .then(done)
      .catch(done);
  });
  it('should send a response with structured item', done => {
    supertest(app)
      .post('/livescores')
      .set('authorization', ['Bearer', authenticationToken].join(' '))
      .set('content-type', 'application/json')
      .send(createdItem)
      .then(response => {
        createdId = response.body.id;
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('title');
        expect(response.body).toHaveProperty('publication');
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of missing resource title', done => {
    supertest(app)
      .post('/livescores')
      .set('authorization', ['Bearer', authenticationToken].join(' '))
      .set('content-type', 'application/json')
      .send({ ...createdItem, title: undefined })
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of resource title bad type (number)', done => {
    supertest(app)
      .post('/livescores')
      .set('authorization', ['Bearer', authenticationToken].join(' '))
      .set('content-type', 'application/json')
      .send({ ...createdItem, title: 1 })
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of resource title bad type (boolean)', done => {
    supertest(app)
      .post('/livescores')
      .set('authorization', ['Bearer', authenticationToken].join(' '))
      .set('content-type', 'application/json')
      .send({ ...createdItem, title: true })
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of missing resource publication date', done => {
    supertest(app)
      .post('/livescores')
      .set('authorization', ['Bearer', authenticationToken].join(' '))
      .set('content-type', 'application/json')
      .send({ ...createdItem, publication: undefined })
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of resource publication date bad type (number)', done => {
    supertest(app)
      .post('/livescores')
      .set('authorization', ['Bearer', authenticationToken].join(' '))
      .set('content-type', 'application/json')
      .send({ ...createdItem, publication: 1 })
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of resource publication date bad type (boolean)', done => {
    supertest(app)
      .post('/livescores')
      .set('authorization', ['Bearer', authenticationToken].join(' '))
      .set('content-type', 'application/json')
      .send({ ...createdItem, publication: true })
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of resource publication date format is not ISO', done => {
    supertest(app)
      .post('/livescores')
      .set('authorization', ['Bearer', authenticationToken].join(' '))
      .set('content-type', 'application/json')
      .send({ ...createdItem, publicationDate: 'xyz' })
      .send({ ...createdItem, publication: true })
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of missing authentication token', done => {
    supertest(app)
      .post('/livescores')
      .set('content-type', 'application/json')
      .send(createdItem)
      .then(response => {
        expect(response.status).toBe(401);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of invalid authentication token', done => {
    supertest(app)
      .post('/livescores')
      .set('authorization', ['Bearer', '0123456789abcdef'].join(' '))
      .set('content-type', 'application/json')
      .send(createdItem)
      .then(response => {
        expect(response.status).toBe(401);
      })
      .then(done)
      .catch(done);
  });
  it('should send a response with security headers', done => {
    supertest(app)
      .post('/livescores')
      .set('authorization', ['Bearer', authenticationToken].join(' '))
      .set('content-type', 'application/json')
      .send(createdItem)
      .then(response => {
        securityHeaders.forEach(headerName => expect(response.headers[headerName]).toBeDefined());
        expect(response.headers['x-powered-by']).not.toBeDefined();
      })
      .then(done)
      .catch(done);
  });
});

describe('PATCH /livescores/:id', () => {
  const originalItem = { title: 'Nodemon for noobs', publication: '2013-12-30' };
  const updatedItem = { title: 'NPM for noobs', publication: '2009-05-27' };
  let originalItemId;
  let authenticationToken;

  beforeEach(done => {
    supertest(app).post('/auth/login')
      .send({ username: 'user', password: 'pwd' })
      .then(response => authenticationToken = response.body.token)
      .catch()
      .then(() => supertest(app)
        .post('/livescores')
        .set('authorization', ['Bearer', authenticationToken].join(' '))
        .set('content-type', 'application/json')
        .send(originalItem))
      .then(response => {
        originalItemId = response.body.id;
      })
      .then(done);
  });
  afterEach(done => {
    if (originalItemId) {
      supertest(app)
        .delete(`/livescores/${originalItemId}`)
        .set('authorization', ['Bearer', authenticationToken].join(' '))
        .catch().finally(done);
    } else {
      done();
    }
  });

  it('should send a success response with full resource', done => {
    supertest(app)
      .patch(`/livescores/${originalItemId}`)
      .set('authorization', ['Bearer', authenticationToken].join(' '))
      .set('content-type', 'application/json')
      .send(updatedItem)
      .then(response => {
        expect(response.status).toBe(200);
      })
      .then(done)
      .catch(done);
  });
  it('should send a success response with partial resource (without title)', done => {
    supertest(app)
      .patch(`/livescores/${originalItemId}`)
      .set('authorization', ['Bearer', authenticationToken].join(' '))
      .set('content-type', 'application/json')
      .send({ ...updatedItem, title: undefined })
      .then(response => {
        expect(response.status).toBe(200);
      })
      .then(done)
      .catch(done);
  });
  it('should send a success response with partial resource (without publication date)', done => {
    supertest(app)
      .patch(`/livescores/${originalItemId}`)
      .set('authorization', ['Bearer', authenticationToken].join(' '))
      .set('content-type', 'application/json')
      .send({ ...updatedItem, publication: undefined })
      .then(response => {
        expect(response.status).toBe(200);
      })
      .then(done)
      .catch(done);
  });
  it('should send a response with structured item', done => {
    supertest(app)
      .patch(`/livescores/${originalItemId}`)
      .set('authorization', ['Bearer', authenticationToken].join(' '))
      .set('content-type', 'application/json')
      .send(updatedItem)
      .then(response => {
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('title');
        expect(response.body).toHaveProperty('publication');
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of negative resource  id', done => {
    supertest(app)
      .patch('/livescores/-1')
      .set('authorization', ['Bearer', authenticationToken].join(' '))
      .set('content-type', 'application/json')
      .send(updatedItem)
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of not positive resource id', done => {
    supertest(app)
      .patch('/livescores/0')
      .set('authorization', ['Bearer', authenticationToken].join(' '))
      .set('content-type', 'application/json')
      .send(updatedItem)
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of resource id bad type', done => {
    supertest(app)
      .patch('/livescores/xyz')
      .set('authorization', ['Bearer', authenticationToken].join(' '))
      .set('content-type', 'application/json')
      .send(updatedItem)
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of resource title bad type (number)', done => {
    supertest(app)
      .patch(`/livescores/${originalItemId}`)
      .set('authorization', ['Bearer', authenticationToken].join(' '))
      .set('content-type', 'application/json')
      .send({ ...updatedItem, title: 1 })
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of resource title bad type (boolean)', done => {
    supertest(app)
      .patch(`/livescores/${originalItemId}`)
      .set('authorization', ['Bearer', authenticationToken].join(' '))
      .set('content-type', 'application/json')
      .send({ ...updatedItem, title: true })
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of resource publication date bad type (number)', done => {
    supertest(app)
      .patch(`/livescores/${originalItemId}`)
      .set('authorization', ['Bearer', authenticationToken].join(' '))
      .set('content-type', 'application/json')
      .send({ ...updatedItem, publication: 1 })
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of resource publication date bad type (boolean)', done => {
    supertest(app)
      .patch(`/livescores/${originalItemId}`)
      .set('authorization', ['Bearer', authenticationToken].join(' '))
      .set('content-type', 'application/json')
      .send({ ...updatedItem, publication: true })
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of resource publication date format is not ISO', done => {
    supertest(app)
      .patch(`/livescores/${originalItemId}`)
      .set('authorization', ['Bearer', authenticationToken].join(' '))
      .set('content-type', 'application/json')
      .send({ ...updatedItem, publicationDate: 'xyz' })
      .send({ ...updatedItem, publication: true })
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of not found item', done => {
    supertest(app)
      .patch(`/livescores/${nonExistentId}`)
      .set('authorization', ['Bearer', authenticationToken].join(' '))
      .set('content-type', 'application/json')
      .send(updatedItem)
      .then(response => {
        expect(response.status).toBe(404);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of missing authentication token', done => {
    supertest(app)
      .patch(`/livescores/${originalItemId}`)
      .set('content-type', 'application/json')
      .send(updatedItem)
      .then(response => {
        expect(response.status).toBe(401);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of invalid authentication token', done => {
    supertest(app)
      .patch(`/livescores/${originalItemId}`)
      .set('content-type', 'application/json')
      .send(updatedItem)
      .then(response => {
        expect(response.status).toBe(401);
      })
      .then(done)
      .catch(done);
  });
  it('should send a response with security headers', done => {
    supertest(app)
      .patch(`/livescores/${originalItemId}`)
      .set('authorization', ['Bearer', authenticationToken].join(' '))
      .set('content-type', 'application/json')
      .send(updatedItem)
      .then(response => {
        securityHeaders.forEach(headerName => expect(response.headers[headerName]).toBeDefined());
        expect(response.headers['x-powered-by']).not.toBeDefined();
      })
      .then(done)
      .catch(done);
  });
});

describe('PUT /livescores/:id', () => {
  const originalItem = { title: 'Nodemon for noobs', publication: '2013-12-30' };
  const updatedItem = { title: 'NPM for noobs', publication: '2010-01-01' };
  let originalItemId;
  let authenticationToken;

  beforeEach(done => {
    supertest(app).post('/auth/login')
      .send({ username: 'user', password: 'pwd' })
      .then(response => authenticationToken = response.body.token)
      .catch()
      .then(() => supertest(app)
        .post('/livescores')
        .set('authorization', ['Bearer', authenticationToken].join(' '))
        .set('content-type', 'application/json')
        .send(originalItem))
      .then(response => {
        originalItemId = response.body.id;
      })
      .then(done);
  });
  afterEach(done => {
    if (originalItemId) {
      supertest(app)
        .delete(`/livescores/${originalItemId}`)
        .set('authorization', ['Bearer', authenticationToken].join(' '))
        .catch().finally(done);
    } else {
      done();
    }
  });

  it('should send a success response', done => {
    supertest(app)
      .put(`/livescores/${originalItemId}`)
      .set('authorization', ['Bearer', authenticationToken].join(' '))
      .set('content-type', 'application/json')
      .send(updatedItem)
      .then(response => {
        expect(response.status).toBe(200);
      })
      .then(done)
      .catch(done);
  });
  it('should send a response with structured item', done => {
    supertest(app)
      .put(`/livescores/${originalItemId}`)
      .set('authorization', ['Bearer', authenticationToken].join(' '))
      .set('content-type', 'application/json')
      .send(updatedItem)
      .then(response => {
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('title');
        expect(response.body).toHaveProperty('publication');
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of negative resource id', done => {
    supertest(app)
      .put('/livescores/-1')
      .set('authorization', ['Bearer', authenticationToken].join(' '))
      .set('content-type', 'application/json')
      .send(updatedItem)
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of not positive resource id', done => {
    supertest(app)
      .put('/livescores/0')
      .set('authorization', ['Bearer', authenticationToken].join(' '))
      .set('content-type', 'application/json')
      .send(updatedItem)
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of resource id bad type', done => {
    supertest(app)
      .put('/livescores/xyz')
      .set('authorization', ['Bearer', authenticationToken].join(' '))
      .set('content-type', 'application/json')
      .send(updatedItem)
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of missing resource title', done => {
    supertest(app)
      .put(`/livescores/${originalItemId}`)
      .set('authorization', ['Bearer', authenticationToken].join(' '))
      .set('content-type', 'application/json')
      .send({ ...updatedItem, title: undefined })
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of resource title bad type (number)', done => {
    supertest(app)
      .put(`/livescores/${originalItemId}`)
      .set('authorization', ['Bearer', authenticationToken].join(' '))
      .set('content-type', 'application/json')
      .send({ ...updatedItem, title: 1 })
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of resource title bad type (boolean)', done => {
    supertest(app)
      .put(`/livescores/${originalItemId}`)
      .set('authorization', ['Bearer', authenticationToken].join(' '))
      .set('content-type', 'application/json')
      .send({ ...updatedItem, title: true })
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of missing resource publication date', done => {
    supertest(app)
      .put(`/livescores/${originalItemId}`)
      .set('authorization', ['Bearer', authenticationToken].join(' '))
      .set('content-type', 'application/json')
      .send({ ...updatedItem, publication: undefined })
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of resource publication date bad type (number)', done => {
    supertest(app)
      .put(`/livescores/${originalItemId}`)
      .set('authorization', ['Bearer', authenticationToken].join(' '))
      .set('content-type', 'application/json')
      .send({ ...updatedItem, publication: 1 })
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of resource publication date bad type (boolean)', done => {
    supertest(app)
      .put(`/livescores/${originalItemId}`)
      .set('authorization', ['Bearer', authenticationToken].join(' '))
      .set('content-type', 'application/json')
      .send({ ...updatedItem, publication: true })
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of resource publication date format is not ISO', done => {
    supertest(app)
      .put(`/livescores/${originalItemId}`)
      .set('authorization', ['Bearer', authenticationToken].join(' '))
      .set('content-type', 'application/json')
      .send({ ...updatedItem, publicationDate: 'xyz' })
      .send({ ...updatedItem, publication: true })
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of not found item', done => {
    supertest(app)
      .put(`/livescores/${nonExistentId}`)
      .set('authorization', ['Bearer', authenticationToken].join(' '))
      .set('content-type', 'application/json')
      .send(updatedItem)
      .then(response => {
        expect(response.status).toBe(404);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of missing authentication token', done => {
    supertest(app)
      .put(`/livescores/${originalItemId}`)
      .set('content-type', 'application/json')
      .send(updatedItem)
      .then(response => {
        expect(response.status).toBe(401);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of invalid authentication token', done => {
    supertest(app)
      .put(`/livescores/${originalItemId}`)
      .set('content-type', 'application/json')
      .send(updatedItem)
      .then(response => {
        expect(response.status).toBe(401);
      })
      .then(done)
      .catch(done);
  });
  it('should send a response with security headers', done => {
    supertest(app)
      .put(`/livescores/${originalItemId}`)
      .set('authorization', ['Bearer', authenticationToken].join(' '))
      .set('content-type', 'application/json')
      .send(updatedItem)
      .then(response => {
        securityHeaders.forEach(headerName => expect(response.headers[headerName]).toBeDefined());
        expect(response.headers['x-powered-by']).not.toBeDefined();
      })
      .then(done)
      .catch(done);
  });
});

describe('DELETE /livescores/:id', () => {
  const originalItem = { title: 'Nodemon for noobs', publication: '2013-12-30' };
  let createdId;
  let authenticationToken;

  beforeEach(done => {
    supertest(app).post('/auth/login')
      .send({ username: 'admin', password: 'pwd' })
      .then(response => authenticationToken = response.body.token)
      .catch()
      .then(() => supertest(app)
        .post('/livescores')
        .set('authorization', ['Bearer', authenticationToken].join(' '))
        .set('content-type', 'application/json')
        .send(originalItem))
      .then(response => {
        createdId = response.body.id;
      })
      .then(done);
  });
  afterEach(done => {
    if (createdId) {
      supertest(app)
        .delete(`/livescores/${createdId}`)
        .set('authorization', ['Bearer', authenticationToken].join(' '))
        .catch().finally(done);
    } else {
      done();
    }
  });

  it('should send a success response', done => {
    supertest(app)
      .delete(`/livescores/${createdId}`)
      .set('authorization', ['Bearer', authenticationToken].join(' '))
      .then(response => {
        expect(response.status).toBe(204);
      })
      .then(done)
      .catch(done);
  });
  it('should send an empty response', done => {
    supertest(app)
      .delete(`/livescores/${createdId}`)
      .set('authorization', ['Bearer', authenticationToken].join(' '))
      .then(response => {
        expect(response.text).toBe('');
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of negative resource id', done => {
    supertest(app)
      .delete('/livescores/-1')
      .set('authorization', ['Bearer', authenticationToken].join(' '))
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of not positive resource id', done => {
    supertest(app)
      .delete('/livescores/0')
      .set('authorization', ['Bearer', authenticationToken].join(' '))
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of resource id bad type', done => {
    supertest(app)
      .delete('/livescores/xyz')
      .set('authorization', ['Bearer', authenticationToken].join(' '))
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of not found item', done => {
    supertest(app)
      .delete(`/livescores/${nonExistentId}`)
      .set('authorization', ['Bearer', authenticationToken].join(' '))
      .then(response => {
        expect(response.status).toBe(404);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of missing authentication token', done => {
    supertest(app)
      .delete(`/livescores/${createdId}`)
      .then(response => {
        expect(response.status).toBe(401);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of invalid authentication token', done => {
    supertest(app)
      .delete(`/livescores/${createdId}`)
      .then(response => {
        expect(response.status).toBe(401);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of ungranted role', done => {
    supertest(app).post('/auth/login')
      .send({ username: 'user', password: 'pwd' })
      .then(response => response.body.token)
      .then(ungrantedAuthenticationToken => supertest(app)
        .delete(`/livescores/${createdId}`)
        .set('authorization', ['Bearer', ungrantedAuthenticationToken].join(' ')))
      .then(response => {
        expect(response.status).toBe(403);
      })
      .then(done)
      .catch(done);
  });
  it('should send a response with security headers', done => {
    supertest(app)
      .delete(`/livescores/${createdId}`)
      .set('authorization', ['Bearer', authenticationToken].join(' '))
      .then(response => {
        securityHeaders.forEach(headerName => expect(response.headers[headerName]).toBeDefined());
        expect(response.headers['x-powered-by']).not.toBeDefined();
      })
      .then(done)
      .catch(done);
  });
});
