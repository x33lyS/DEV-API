import supertest from 'supertest';
import { app } from './app.js';
import { sequelize } from './common/database.config.js';
import { LiveScoreModel } from './live-score/live-score.model.js';
import { liveScores } from './live-score/live-score.mock.js';
import { users } from './user/user.database-mock.js';
import { UserModel } from './user/user.model.js';

const nonExistentId = Number.MAX_SAFE_INTEGER;
const liveScoreExistingIds = [];
const userExistingIds = [];

beforeAll(async () => {
  await sequelize.sync();
  await LiveScoreModel.destroy({ truncate: true, restartIdentity: true });
  await UserModel.destroy({ truncate: true, restartIdentity: true });
  for (const liveScore of liveScores) {
    const model = await LiveScoreModel.create({
      date: liveScore.date,
      homeTeamName: liveScore.homeTeamName,
      awayTeamName: liveScore.awayTeamName,
      homeTeamScore: liveScore.homeTeamScore,
      awayTeamScore: liveScore.awayTeamScore,
    });
    liveScoreExistingIds.push(model.id);
  }
  for (const user of users) {
    try {
      const model = await UserModel.create({
        email: user.email,
        password: user.password,
        role: user.role,
      });
      userExistingIds.push(model.id);
    } catch (error) {
      console.error(error);
    }
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


describe('GET /live-scores', () => {
  it('should send a success response with first page items', done => {
    const pageIndex = 0;
    const pageSize = 50;

    supertest(app)
      .get(`/live-scores?pageIndex=${pageIndex}&pageSize=${pageSize}`)
      .then(response => {
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBe(50);
      })
      .then(done)
      .catch(done);
  });
  it('should send a success response with second page items', done => {
    const pageIndex = 1;
    const pageSize = 50;

    supertest(app)
      .get(`/live-scores?pageIndex=${pageIndex}&pageSize=${pageSize}`)
      .then(response => {
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBe(50);
      })
      .then(done)
      .catch(done);
  });
  it('should send a success response with third page items', done => {
    const pageIndex = 2;
    const pageSize = 50;

    supertest(app)
      .get(`/live-scores?pageIndex=${pageIndex}&pageSize=${pageSize}`)
      .then(response => {
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBe(20);
      })
      .then(done)
      .catch(done);
  });
  it('should send a success response with fourth page items', done => {
    const pageIndex = 3;
    const pageSize = 50;

    supertest(app)
      .get(`/live-scores?pageIndex=${pageIndex}&pageSize=${pageSize}`)
      .then(response => {
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBe(0);
      })
      .then(done)
      .catch(done);
  });
  it('should send a success response with with a page of 100 items', done => {
    const pageIndex = 0;
    const pageSize = 100;

    supertest(app)
      .get(`/live-scores?pageIndex=${pageIndex}&pageSize=${pageSize}`)
      .then(response => {
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBe(100);
      })
      .then(done)
      .catch(done);
  });
  it('should send a response with all items count for first page', done => {
    const pageIndex = 0;
    const pageSize = 50;

    supertest(app)
      .get(`/live-scores?pageIndex=${pageIndex}&pageSize=${pageSize}`)
      .then(response => {
        expect(response.headers['x-total-count']).toEqual('120');
      })
      .then(done)
      .catch(done);
  });
  it('should send a response with all items count for second page', done => {
    const pageIndex = 1;
    const pageSize = 50;

    supertest(app)
      .get(`/live-scores?pageIndex=${pageIndex}&pageSize=${pageSize}`)
      .then(response => {
        expect(response.headers['x-total-count']).toEqual('120');
      })
      .then(done)
      .catch(done);
  });
  it('should send a response with all items count for third page', done => {
    const pageIndex = 2;
    const pageSize = 50;

    supertest(app)
      .get(`/live-scores?pageIndex=${pageIndex}&pageSize=${pageSize}`)
      .then(response => {
        expect(response.headers['x-total-count']).toEqual('120');
      })
      .then(done)
      .catch(done);
  });
  it('should send a response with all items count for fourth page', done => {
    const pageIndex = 3;
    const pageSize = 50;

    supertest(app)
      .get(`/live-scores?pageIndex=${pageIndex}&pageSize=${pageSize}`)
      .then(response => {
        expect(response.headers['x-total-count']).toEqual('120');
      })
      .then(done)
      .catch(done);
  });
  it('should send a response with structured items', done => {
    const pageIndex = 0;
    const pageSize = 50;

    supertest(app)
      .get(`/live-scores?pageIndex=${pageIndex}&pageSize=${pageSize}`)
      .then(response => {
        response.body.forEach(item => {
          expect(item).toHaveProperty('id');
          expect(item).toHaveProperty('date');
          expect(item).toHaveProperty('homeTeamName');
          expect(item).toHaveProperty('awayTeamName');
          expect(item).toHaveProperty('homeTeamScore');
          expect(item).toHaveProperty('awayTeamScore');
        });
      })
      .then(done)
      .catch(done);
  });
  it('should send a error response because of bad parameter (page index missing)', done => {
    const pageIndex = -1;
    const pageSize = 50;

    supertest(app)
      .get(`/live-scores?pageIndex=${pageIndex}&pageSize=${pageSize}`)
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send a error response because of bad parameter (page index non natural)', done => {
    const pageSize = 50;

    supertest(app)
      .get(`/live-scores?pageSize=${pageSize}`)
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send a error response because of bad parameter (page index type)', done => {
    const pageIndex = 'xyz';
    const pageSize = 50;

    supertest(app)
      .get(`/live-scores?pageIndex=${pageIndex}&pageSize=${pageSize}`)
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send a error response because of bad parameter (page size missing)', done => {
    const pageIndex = 0;
    const pageSize = 0;

    supertest(app)
      .get(`/live-scores?pageIndex=${pageIndex}&pageSize=${pageSize}`)
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send a error response because of bad parameter (page size non positive)', done => {
    const pageIndex = 0;

    supertest(app)
      .get(`/live-scores?pageIndex=${pageIndex}`)
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send a error response because of bad parameter (page size type)', done => {
    const pageIndex = 0;
    const pageSize = 'xyz';

    supertest(app)
      .get(`/live-scores?pageIndex=${pageIndex}&pageSize=${pageSize}`)
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
});

describe('GET /live-scores/:id', () => {
  it('should send a success response', done => {
    supertest(app)
      .get(`/live-scores/${liveScoreExistingIds[0]}`)
      .then(response => {
        expect(response.status).toBe(200);
      })
      .then(done)
      .catch(done);
  });
  it('should send a response with structured item', done => {
    supertest(app)
      .get(`/live-scores/${liveScoreExistingIds[0]}`)
      .then(response => {
        const item  = response.body;
        expect(item).toHaveProperty('id');
        expect(item).toHaveProperty('date');
        expect(item).toHaveProperty('homeTeamName');
        expect(item).toHaveProperty('awayTeamName');
        expect(item).toHaveProperty('homeTeamScore');
        expect(item).toHaveProperty('awayTeamScore');
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource id (negative)', done => {
    supertest(app)
      .get('/live-scores/-1')
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource id (not positive)', done => {
    supertest(app)
      .get('/live-scores/0')
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource id (type)', done => {
    supertest(app)
      .get('/live-scores/xyz')
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of not found item', done => {
    supertest(app)
      .get(`/live-scores/${nonExistentId}`)
      .then(response => {
        expect(response.status).toBe(404);
      })
      .then(done)
      .catch(done);
  });
});

describe('POST /live-scores/', () => {
  const createdItem = {
    date: '2017-08-03T20:45:00.000+01:00',
    homeTeamName: 'Barcelona',
    awayTeamName: 'Paris Saint-Germain',
    homeTeamScore: 6,
    awayTeamScore: 1
  };
  let createdItemId;

  beforeEach(() => createdItemId = null);
  afterEach(done => {
    if (createdItemId) {
      supertest(app).delete(`/live-scores/${createdItemId}`).catch().finally(done);
    } else {
      done();
    }
  })

  it('should send a success response', done => {
    supertest(app)
      .post('/live-scores')
      .set('content-type', 'application/json')
      .send(createdItem)
      .then(response => {
        createdItemId = response.body.id;
        expect(response.status).toBe(201);
      })
      .then(done)
      .catch(done);
  });
  it('should send a success response without home team score', done => {
    supertest(app)
      .post('/live-scores')
      .set('content-type', 'application/json')
      .send({ ...createdItem, homeTeamScore: null })
      .then(response => {
        createdItemId = response.body.id;
        expect(response.status).toBe(201);
      })
      .then(done)
      .catch(done);
  });
  it('should send a success response without away team score', done => {
    supertest(app)
      .post('/live-scores')
      .set('content-type', 'application/json')
      .send({ ...createdItem, awayTeamScore: null })
      .then(response => {
        createdItemId = response.body.id;
        expect(response.status).toBe(201);
      })
      .then(done)
      .catch(done);
  });
  it('should send a response with structured item', done => {
    supertest(app)
      .post('/live-scores')
      .set('content-type', 'application/json')
      .send(createdItem)
      .then(response => {
        createdItemId = response.body.id;
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('date');
        expect(response.body).toHaveProperty('homeTeamName');
        expect(response.body).toHaveProperty('awayTeamName');
        expect(response.body).toHaveProperty('homeTeamScore');
        expect(response.body).toHaveProperty('awayTeamScore');
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource (date missing)', done => {
    supertest(app)
      .post('/live-scores')
      .set('content-type', 'application/json')
      .send({ ...createdItem, date: undefined })
      .then(response => {
        createdItemId = response.body.id;
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource (date null)', done => {
    supertest(app)
      .post('/live-scores')
      .set('content-type', 'application/json')
      .send({ ...createdItem, date: null })
      .then(response => {
        createdItemId = response.body.id;
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource (date type)', done => {
    supertest(app)
      .post('/live-scores')
      .set('content-type', 'application/json')
      .send({ ...createdItem, date: 1 })
      .then(response => {
        createdItemId = response.body.id;
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource (date non ISO)', done => {
    supertest(app)
      .post('/live-scores')
      .set('content-type', 'application/json')
      .send({ ...createdItem, date: 'xyz' })
      .then(response => {
        createdItemId = response.body.id;
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource (home team name missing)', done => {
    supertest(app)
      .post('/live-scores')
      .set('content-type', 'application/json')
      .send({ ...createdItem, homeTeamName: undefined })
      .then(response => {
        createdItemId = response.body.id;
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource (home team name null)', done => {
    supertest(app)
      .post('/live-scores')
      .set('content-type', 'application/json')
      .send({ ...createdItem, homeTeamName: null })
      .then(response => {
        createdItemId = response.body.id;
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource (home team name empty)', done => {
    supertest(app)
      .post('/live-scores')
      .set('content-type', 'application/json')
      .send({ ...createdItem, homeTeamName: '' })
      .then(response => {
        createdItemId = response.body.id;
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource (home team name type)', done => {
    supertest(app)
      .post('/live-scores')
      .set('content-type', 'application/json')
      .send({ ...createdItem, homeTeamName: 1 })
      .then(response => {
        createdItemId = response.body.id;
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource (away team name missing)', done => {
    supertest(app)
      .post('/live-scores')
      .set('content-type', 'application/json')
      .send({ ...createdItem, awayTeamName: undefined })
      .then(response => {
        createdItemId = response.body.id;
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource (away team name null)', done => {
    supertest(app)
      .post('/live-scores')
      .set('content-type', 'application/json')
      .send({ ...createdItem, awayTeamName: null })
      .then(response => {
        createdItemId = response.body.id;
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource (away team name empty)', done => {
    supertest(app)
      .post('/live-scores')
      .set('content-type', 'application/json')
      .send({ ...createdItem, awayTeamName: '' })
      .then(response => {
        createdItemId = response.body.id;
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource (away team name type)', done => {
    supertest(app)
      .post('/live-scores')
      .set('content-type', 'application/json')
      .send({ ...createdItem, awayTeamName: 1 })
      .then(response => {
        createdItemId = response.body.id;
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource (home team score negative)', done => {
    supertest(app)
      .post('/live-scores')
      .set('content-type', 'application/json')
      .send({ ...createdItem, homeTeamScore: -1 })
      .then(response => {
        createdItemId = response.body.id;
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource (home team score type)', done => {
    supertest(app)
      .post('/live-scores')
      .set('content-type', 'application/json')
      .send({ ...createdItem, homeTeamScore: '0' })
      .then(response => {
        createdItemId = response.body.id;
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource (home team score non integer)', done => {
    supertest(app)
      .post('/live-scores')
      .set('content-type', 'application/json')
      .send({ ...createdItem, homeTeamScore: 0.5 })
      .then(response => {
        createdItemId = response.body.id;
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource (away team score negative)', done => {
    supertest(app)
      .post('/live-scores')
      .set('content-type', 'application/json')
      .send({ ...createdItem, awayTeamScore: -1 })
      .then(response => {
        createdItemId = response.body.id;
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource (away team score type)', done => {
    supertest(app)
      .post('/live-scores')
      .set('content-type', 'application/json')
      .send({ ...createdItem, awayTeamScore: '0' })
      .then(response => {
        createdItemId = response.body.id;
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource (away team score non integer)', done => {
    supertest(app)
      .post('/live-scores')
      .set('content-type', 'application/json')
      .send({ ...createdItem, awayTeamScore: 0.5 })
      .then(response => {
        createdItemId = response.body.id;
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
});

describe('PATCH /live-scores/:id', () => {
  const originalItem = {
    date: '2017-08-03T20:45:00.000+01:00',
    homeTeamName: 'Barcelona',
    awayTeamName: 'Paris Saint-Germain',
    homeTeamScore: 6,
    awayTeamScore: 1,
  };
  let originalItemId;

  beforeEach(done => {
    supertest(app)
      .post('/live-scores')
      .set('content-type', 'application/json')
      .send(originalItem)
      .then(response => {
        originalItemId = response.body.id;
      })
      .then(done);
  });
  afterEach(done => {
    if (originalItemId) {
      supertest(app).delete(`/live-scores/${originalItemId}`).catch().finally(done);
    } else {
      done();
    }
  });

  it('should send a success response with full resource', done => {
    const updatedItem = {
      date: '2017-08-03T21:00:00.000+01:00',
      homeTeamName: 'FCB',
      awayTeamName: 'PSG',
      homeTeamScore: 5,
      awayTeamScore: 0,
    };

    supertest(app)
      .patch(`/live-scores/${originalItemId}`)
      .set('content-type', 'application/json')
      .send(updatedItem)
      .then(response => {
        expect(response.status).toBe(200);
      })
      .then(done)
      .catch(done);
  });
  it('should send a success response with partial resource (date)', done => {
    const updatedItem = {
      date: '2017-08-03T21:00:00.000+01:00',
    };

    supertest(app)
      .patch(`/live-scores/${originalItemId}`)
      .set('content-type', 'application/json')
      .send(updatedItem)
      .then(response => {
        expect(response.status).toBe(200);
        expect(response.body.date).toBe('2017-08-03T22:00:00.000+02:00');
      })
      .then(done)
      .catch(done);
  });
  it('should send a success response with partial resource (home team name)', done => {
    const updatedItem = {
      homeTeamName: 'FCB',
    };
    supertest(app)
      .patch(`/live-scores/${originalItemId}`)
      .set('content-type', 'application/json')
      .send(updatedItem)
      .then(response => {
        expect(response.status).toBe(200);
        expect(response.body.homeTeamName).toBe('FCB');
      })
      .then(done)
      .catch(done);
  });
  it('should send a success response with partial resource (away team name)', done => {
    const updatedItem = {
      awayTeamName: 'PSG',
    };
    supertest(app)
      .patch(`/live-scores/${originalItemId}`)
      .set('content-type', 'application/json')
      .send(updatedItem)
      .then(response => {
        expect(response.status).toBe(200);
        expect(response.body.awayTeamName).toBe('PSG');
      })
      .then(done)
      .catch(done);
  });
  it('should send a success response with partial resource (home team score)', done => {
    const updatedItem = {
      homeTeamScore: 5,
    };
    supertest(app)
      .patch(`/live-scores/${originalItemId}`)
      .set('content-type', 'application/json')
      .send(updatedItem)
      .then(response => {
        expect(response.status).toBe(200);
        expect(response.body.homeTeamScore).toBe(5);
      })
      .then(done)
      .catch(done);
  });
  it('should send a success response with partial resource (away team score)', done => {
    const updatedItem = {
      awayTeamScore: 1,
    };
    supertest(app)
      .patch(`/live-scores/${originalItemId}`)
      .set('content-type', 'application/json')
      .send(updatedItem)
      .then(response => {
        expect(response.status).toBe(200);
        expect(response.body.awayTeamScore).toBe(1);
      })
      .then(done)
      .catch(done);
  });
  it('should send a response with structured item', done => {
    const updatedItem = {
      date: '2017-08-03T21:00:00.000+01:00',
    };

    supertest(app)
      .patch(`/live-scores/${originalItemId}`)
      .set('content-type', 'application/json')
      .send(updatedItem)
      .then(response => {
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('date');
        expect(response.body).toHaveProperty('homeTeamName');
        expect(response.body).toHaveProperty('awayTeamName');
        expect(response.body).toHaveProperty('homeTeamScore');
        expect(response.body).toHaveProperty('awayTeamScore');
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource id (negative)', done => {
    const updatedItem = {
      date: '2017-08-03T21:00:00.000+01:00',
    };

    supertest(app)
      .patch('/live-scores/-1')
      .set('content-type', 'application/json')
      .send(updatedItem)
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource id (not positive)', done => {
    const updatedItem = {
      date: '2017-08-03T21:00:00.000+01:00',
    };

    supertest(app)
      .patch('/live-scores/0')
      .set('content-type', 'application/json')
      .send(updatedItem)
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource id (type)', done => {
    const updatedItem = {
      date: '2017-08-03T21:00:00.000+01:00',
    };

    supertest(app)
      .patch('/live-scores/xyz')
      .set('content-type', 'application/json')
      .send(updatedItem)
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource (date null)', done => {
    const updatedItem = {
      date: 1,
    };

    supertest(app)
      .patch(`/live-scores/${originalItemId}`)
      .set('content-type', 'application/json')
      .send(updatedItem)
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource (date type)', done => {
    const updatedItem = {
      date: 1,
    };

    supertest(app)
      .patch(`/live-scores/${originalItemId}`)
      .set('content-type', 'application/json')
      .send(updatedItem)
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource (date non ISO)', done => {
    const updatedItem = {
      date: 'xyz',
    };

    supertest(app)
      .patch(`/live-scores/${originalItemId}`)
      .set('content-type', 'application/json')
      .send(updatedItem)
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource (home team name null)', done => {
    const updatedItem = {
      homeTeamName: 1,
    };

    supertest(app)
      .patch(`/live-scores/${originalItemId}`)
      .set('content-type', 'application/json')
      .send(updatedItem)
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource (home team name empty)', done => {
    const updatedItem = {
      homeTeamName: '',
    };

    supertest(app)
      .patch(`/live-scores/${originalItemId}`)
      .set('content-type', 'application/json')
      .send(updatedItem)
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource (home team name type)', done => {
    const updatedItem = {
      homeTeamName: 1,
    };

    supertest(app)
      .patch(`/live-scores/${originalItemId}`)
      .set('content-type', 'application/json')
      .send(updatedItem)
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource (away team name null)', done => {
    const updatedItem = {
      awayTeamName: 1,
    };

    supertest(app)
      .patch(`/live-scores/${originalItemId}`)
      .set('content-type', 'application/json')
      .send(updatedItem)
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource (away team name empty)', done => {
    const updatedItem = {
      awayTeamName: '',
    };

    supertest(app)
      .patch(`/live-scores/${originalItemId}`)
      .set('content-type', 'application/json')
      .send(updatedItem)
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource (away team name type)', done => {
    const updatedItem = {
      awayTeamName: 1,
    };

    supertest(app)
      .patch(`/live-scores/${originalItemId}`)
      .set('content-type', 'application/json')
      .send(updatedItem)
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource (home team score negative)', done => {
    const updatedItem = {
      homeTeamScore: -1,
    };

    supertest(app)
      .patch(`/live-scores/${originalItemId}`)
      .set('content-type', 'application/json')
      .send(updatedItem)
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource (home team score type)', done => {
    const updatedItem = {
      homeTeamScore: '0',
    };

    supertest(app)
      .patch(`/live-scores/${originalItemId}`)
      .set('content-type', 'application/json')
      .send(updatedItem)
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource (home team score non integer)', done => {
    const updatedItem = {
      homeTeamScore: 0.5,
    };

    supertest(app)
      .patch(`/live-scores/${originalItemId}`)
      .set('content-type', 'application/json')
      .send(updatedItem)
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource (away team score negative)', done => {
    const updatedItem = {
      awayTeamScore: -1,
    };

    supertest(app)
      .patch(`/live-scores/${originalItemId}`)
      .set('content-type', 'application/json')
      .send(updatedItem)
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource (away team score type)', done => {
    const updatedItem = {
      awayTeamScore: '0',
    };

    supertest(app)
      .patch(`/live-scores/${originalItemId}`)
      .set('content-type', 'application/json')
      .send(updatedItem)
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource (away team score non integer)', done => {
    const updatedItem = {
      awayTeamScore: 0.5,
    };

    supertest(app)
      .patch(`/live-scores/${originalItemId}`)
      .set('content-type', 'application/json')
      .send(updatedItem)
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of not found item', done => {
    const updatedItem = {
      date: '2017-08-03T21:00:00.000+01:00',
    };

    supertest(app)
      .patch(`/live-scores/${nonExistentId}`)
      .set('content-type', 'application/json')
      .send(updatedItem)
      .then(response => {
        expect(response.status).toBe(404);
      })
      .then(done)
      .catch(done);
  });
});

describe('PUT /live-scores/:id', () => {
  const originalItem = {
    date: '2017-08-03T20:45:00.000+01:00',
    homeTeamName: 'Barcelona',
    awayTeamName: 'Paris Saint-Germain',
    homeTeamScore: 6,
    awayTeamScore: 1
  };
  const updatedItem = {
    date: '2017-08-03T21:00:00.000+01:00',
    homeTeamName: 'FCB',
    awayTeamName: 'PSG',
    homeTeamScore: 5,
    awayTeamScore: 0
  };
  let originalItemId;

  beforeEach(done => {
    supertest(app)
      .post('/live-scores')
      .set('content-type', 'application/json')
      .send(originalItem)
      .then(response => {
        originalItemId = response.body.id;
      })
      .then(done);
  });
  afterEach(done => {
    if (originalItemId) {
      supertest(app).delete(`/live-scores/${originalItemId}`).catch().finally(done);
    } else {
      done();
    }
  });

  it('should send a success response', done => {
    supertest(app)
      .put(`/live-scores/${originalItemId}`)
      .set('content-type', 'application/json')
      .send(updatedItem)
      .then(response => {
        expect(response.status).toBe(200);
      })
      .then(done)
      .catch(done);
  });
  it('should send a success response without home team score', done => {
    supertest(app)
      .put(`/live-scores/${originalItemId}`)
      .set('content-type', 'application/json')
      .send({ ...updatedItem, homeTeamScore: null })
      .then(response => {
        expect(response.status).toBe(200);
      })
      .then(done)
      .catch(done);
  });
  it('should send a success response without away team score', done => {
    supertest(app)
      .put(`/live-scores/${originalItemId}`)
      .set('content-type', 'application/json')
      .send({ ...updatedItem, awayTeamScore: null })
      .then(response => {
        expect(response.status).toBe(200);
      })
      .then(done)
      .catch(done);
  });
  it('should send a response with structured item', done => {
    supertest(app)
      .put(`/live-scores/${originalItemId}`)
      .set('content-type', 'application/json')
      .send(updatedItem)
      .then(response => {
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('date');
        expect(response.body).toHaveProperty('homeTeamName');
        expect(response.body).toHaveProperty('awayTeamName');
        expect(response.body).toHaveProperty('homeTeamScore');
        expect(response.body).toHaveProperty('awayTeamScore');
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource id (negative)', done => {
    supertest(app)
      .put('/live-scores/-1')
      .set('content-type', 'application/json')
      .send(updatedItem)
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource id (not positive)', done => {
    supertest(app)
      .put('/live-scores/0')
      .set('content-type', 'application/json')
      .send(updatedItem)
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource id (type)', done => {
    supertest(app)
      .put('/live-scores/xyz')
      .set('content-type', 'application/json')
      .send(updatedItem)
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource (date missing)', done => {
    supertest(app)
      .put(`/live-scores/${originalItemId}`)
      .set('content-type', 'application/json')
      .send({ ...updatedItem, date: undefined })
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource (date null)', done => {
    supertest(app)
      .put(`/live-scores/${originalItemId}`)
      .set('content-type', 'application/json')
      .send({ ...updatedItem, date: 'xyz' })
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource (date type)', done => {
    supertest(app)
      .put(`/live-scores/${originalItemId}`)
      .set('content-type', 'application/json')
      .send({ ...updatedItem, date: 'xyz' })
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource (date non ISO)', done => {
    supertest(app)
      .put(`/live-scores/${originalItemId}`)
      .set('content-type', 'application/json')
      .send({ ...updatedItem, date: 'xyz' })
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource (home team name missing)', done => {
    supertest(app)
      .put(`/live-scores/${originalItemId}`)
      .set('content-type', 'application/json')
      .send({ ...updatedItem, homeTeamName: null })
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource (home team name null)', done => {
    supertest(app)
      .put(`/live-scores/${originalItemId}`)
      .set('content-type', 'application/json')
      .send({ ...updatedItem, homeTeamName: null })
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource (home team name empty)', done => {
    supertest(app)
      .put(`/live-scores/${originalItemId}`)
      .set('content-type', 'application/json')
      .send({ ...updatedItem, homeTeamName: '' })
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource (home team name type)', done => {
    supertest(app)
      .put(`/live-scores/${originalItemId}`)
      .set('content-type', 'application/json')
      .send({ ...updatedItem, homeTeamName: 1 })
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource (away team name missing)', done => {
    supertest(app)
      .put(`/live-scores/${originalItemId}`)
      .set('content-type', 'application/json')
      .send({ ...updatedItem, awayTeamName: undefined })
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource (away team name null)', done => {
    supertest(app)
      .put(`/live-scores/${originalItemId}`)
      .set('content-type', 'application/json')
      .send({ ...updatedItem, awayTeamName: null })
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource (away team name type)', done => {
    supertest(app)
      .put(`/live-scores/${originalItemId}`)
      .set('content-type', 'application/json')
      .send({ ...updatedItem, awayTeamName: 1 })
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource (away team name empty)', done => {
    supertest(app)
      .put(`/live-scores/${originalItemId}`)
      .set('content-type', 'application/json')
      .send({ ...updatedItem, awayTeamName: '' })
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource (home team score negative)', done => {
    supertest(app)
      .put(`/live-scores/${originalItemId}`)
      .set('content-type', 'application/json')
      .send({ ...updatedItem, homeTeamScore: -1 })
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource (home team score type)', done => {
    supertest(app)
      .put(`/live-scores/${originalItemId}`)
      .set('content-type', 'application/json')
      .send({ ...updatedItem, homeTeamScore: '0' })
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource (home team score non integer)', done => {
    supertest(app)
      .put(`/live-scores/${originalItemId}`)
      .set('content-type', 'application/json')
      .send({ ...updatedItem, homeTeamScore: 0.5 })
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource (away team score negative)', done => {
    supertest(app)
      .put(`/live-scores/${originalItemId}`)
      .set('content-type', 'application/json')
      .send({ ...updatedItem, awayTeamScore: -1 })
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource (away team score type)', done => {
    supertest(app)
      .put(`/live-scores/${originalItemId}`)
      .set('content-type', 'application/json')
      .send({ ...updatedItem, awayTeamScore: '0' })
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource (away team score non integer)', done => {
    supertest(app)
      .put(`/live-scores/${originalItemId}`)
      .set('content-type', 'application/json')
      .send({ ...updatedItem, awayTeamScore: 0.5 })
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of not found item', done => {
    supertest(app)
      .put(`/live-scores/${nonExistentId}`)
      .set('content-type', 'application/json')
      .send(updatedItem)
      .then(response => {
        expect(response.status).toBe(404);
      })
      .then(done)
      .catch(done);
  });
});

describe('DELETE /live-scores/:id', () => {
  const originalItem = {
    date: '2017-08-03T20:45:00.000+01:00',
    homeTeamName: 'Barcelona',
    awayTeamName: 'Paris Saint-Germain',
    homeTeamScore: 6,
    awayTeamScore: 1
  };
  let createdItemId;

  beforeEach(done => {
    supertest(app)
      .post('/live-scores')
      .set('content-type', 'application/json')
      .send(originalItem)
      .then(response => {
        createdItemId = response.body.id;
      })
      .then(done);
  });
  afterEach(done => {
    if (createdItemId) {
      supertest(app).delete(`/live-scores/${createdItemId}`).catch().finally(done);
    } else {
      done();
    }
  });

  it('should send a success response', done => {
    supertest(app)
      .delete(`/live-scores/${createdItemId}`)
      .then(response => {
        expect(response.status).toBe(204);
      })
      .then(done)
      .catch(done);
  });
  it('should send an empty response', done => {
    supertest(app)
      .delete(`/live-scores/${createdItemId}`)
      .then(response => {
        expect(response.text).toBe('');
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource id (negative)', done => {
    supertest(app)
      .delete('/live-scores/-1')
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource id (not positive)', done => {
    supertest(app)
      .delete('/live-scores/0')
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource id (type)', done => {
    supertest(app)
      .delete('/live-scores/xyz')
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of not found item', done => {
    supertest(app)
      .delete(`/live-scores/${nonExistentId}`)
      .then(response => {
        expect(response.status).toBe(404);
      })
      .then(done)
      .catch(done);
  });
});

describe('GET /users', () => {
  it('should send a success response with first page items', done => {
    const pageIndex = 0;
    const pageSize = 50;

    supertest(app)
      .get(`/users?pageIndex=${pageIndex}&pageSize=${pageSize}`)
      .then(response => {
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBe(2);
      })
      .then(done)
      .catch(done);
  });
  it('should send a success response with second page items', done => {
    const pageIndex = 1;
    const pageSize = 50;

    supertest(app)
      .get(`/users?pageIndex=${pageIndex}&pageSize=${pageSize}`)
      .then(response => {
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBe(0);
      })
      .then(done)
      .catch(done);
  });
  it('should send a success response with with a page of 100 items', done => {
    const pageIndex = 0;
    const pageSize = 100;

    supertest(app)
      .get(`/users?pageIndex=${pageIndex}&pageSize=${pageSize}`)
      .then(response => {
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBe(2);
      })
      .then(done)
      .catch(done);
  });
  it('should send a response with all items count for first page', done => {
    const pageIndex = 0;
    const pageSize = 50;

    supertest(app)
      .get(`/users?pageIndex=${pageIndex}&pageSize=${pageSize}`)
      .then(response => {
        expect(response.headers['x-total-count']).toEqual('2');
      })
      .then(done)
      .catch(done);
  });
  it('should send a response with all items count for second page', done => {
    const pageIndex = 1;
    const pageSize = 50;

    supertest(app)
      .get(`/users?pageIndex=${pageIndex}&pageSize=${pageSize}`)
      .then(response => {
        expect(response.headers['x-total-count']).toEqual('2');
      })
      .then(done)
      .catch(done);
  });
  it('should send a response with structured items', done => {
    const pageIndex = 0;
    const pageSize = 50;

    supertest(app)
      .get(`/users?pageIndex=${pageIndex}&pageSize=${pageSize}`)
      .then(response => {
        response.body.forEach(item => {
          expect(item).toHaveProperty('id');
          expect(item).toHaveProperty('email');
          expect(item).toHaveProperty('role');
          expect(item).not.toHaveProperty('password');
        });
      })
      .then(done)
      .catch(done);
  });
  it('should send a error response because of bad parameter (page index missing)', done => {
    const pageIndex = -1;
    const pageSize = 50;

    supertest(app)
      .get(`/users?pageIndex=${pageIndex}&pageSize=${pageSize}`)
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send a error response because of bad parameter (page index non natural)', done => {
    const pageSize = 50;

    supertest(app)
      .get(`/users?pageSize=${pageSize}`)
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send a error response because of bad parameter (page index type)', done => {
    const pageIndex = 'xyz';
    const pageSize = 50;

    supertest(app)
      .get(`/users?pageIndex=${pageIndex}&pageSize=${pageSize}`)
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send a error response because of bad parameter (page size missing)', done => {
    const pageIndex = 0;
    const pageSize = 0;

    supertest(app)
      .get(`/users?pageIndex=${pageIndex}&pageSize=${pageSize}`)
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send a error response because of bad parameter (page size non positive)', done => {
    const pageIndex = 0;

    supertest(app)
      .get(`/users?pageIndex=${pageIndex}`)
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send a error response because of bad parameter (page size type)', done => {
    const pageIndex = 0;
    const pageSize = 'xyz';

    supertest(app)
      .get(`/users?pageIndex=${pageIndex}&pageSize=${pageSize}`)
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
});

describe('GET /users/:id', () => {
  it('should send a success response', done => {
    supertest(app)
      .get(`/users/${userExistingIds[0]}`)
      .then(response => {
        expect(response.status).toBe(200);
      })
      .then(done)
      .catch(done);
  });
  it('should send a response with structured item', done => {
    supertest(app)
      .get(`/users/${userExistingIds[0]}`)
      .then(response => {
        const item  = response.body;
        expect(item).toHaveProperty('id');
        expect(item).toHaveProperty('email');
        expect(item).toHaveProperty('role');
        expect(item).not.toHaveProperty('password');
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource id (negative)', done => {
    supertest(app)
      .get('/users/-1')
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource id (not positive)', done => {
    supertest(app)
      .get('/users/0')
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource id (type)', done => {
    supertest(app)
      .get('/users/xyz')
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of not found item', done => {
    supertest(app)
      .get(`/users/${nonExistentId}`)
      .then(response => {
        expect(response.status).toBe(404);
      })
      .then(done)
      .catch(done);
  });
});

describe('POST /users/', () => {
  const createdItem = {
    email: 'john@ynov.com',
    password: 'pwd',
    role: 'contributor',
  };
  let createdItemId;

  beforeEach(() => createdItemId = null);
  afterEach(done => {
    if (createdItemId) {
      supertest(app).delete(`/users/${createdItemId}`).catch().finally(done);
    } else {
      done();
    }
  })

  it('should send a success response', done => {
    supertest(app)
      .post('/users')
      .set('content-type', 'application/json')
      .send(createdItem)
      .then(response => {
        createdItemId = response.body.id;
        expect(response.status).toBe(201);
      })
      .then(done)
      .catch(done);
  });
  it('should send a response with structured item', done => {
    supertest(app)
      .post('/users')
      .set('content-type', 'application/json')
      .send(createdItem)
      .then(response => {
        const item  = response.body;
        createdItemId = item.id;
        expect(item).toHaveProperty('id');
        expect(item).toHaveProperty('email');
        expect(item).toHaveProperty('role');
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource (email missing)', done => {
    supertest(app)
      .post('/users')
      .set('content-type', 'application/json')
      .send({ ...createdItem, email: undefined })
      .then(response => {
        createdItemId = response.body.id;
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource (email null)', done => {
    supertest(app)
      .post('/users')
      .set('content-type', 'application/json')
      .send({ ...createdItem, email: null })
      .then(response => {
        createdItemId = response.body.id;
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource (email type)', done => {
    supertest(app)
      .post('/users')
      .set('content-type', 'application/json')
      .send({ ...createdItem, email: 1 })
      .then(response => {
        createdItemId = response.body.id;
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource (email empty)', done => {
    supertest(app)
      .post('/users')
      .set('content-type', 'application/json')
      .send({ ...createdItem, email: '' })
      .then(response => {
        createdItemId = response.body.id;
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource (password missing)', done => {
    supertest(app)
      .post('/users')
      .set('content-type', 'application/json')
      .send({ ...createdItem, password: undefined })
      .then(response => {
        createdItemId = response.body.id;
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource (password null)', done => {
    supertest(app)
      .post('/users')
      .set('content-type', 'application/json')
      .send({ ...createdItem, password: null })
      .then(response => {
        createdItemId = response.body.id;
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource (password type)', done => {
    supertest(app)
      .post('/users')
      .set('content-type', 'application/json')
      .send({ ...createdItem, password: 1 })
      .then(response => {
        createdItemId = response.body.id;
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource (password empty)', done => {
    supertest(app)
      .post('/users')
      .set('content-type', 'application/json')
      .send({ ...createdItem, password: '' })
      .then(response => {
        createdItemId = response.body.id;
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource (role missing)', done => {
    supertest(app)
      .post('/users')
      .set('content-type', 'application/json')
      .send({ ...createdItem, role: undefined })
      .then(response => {
        createdItemId = response.body.id;
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource (role null)', done => {
    supertest(app)
      .post('/users')
      .set('content-type', 'application/json')
      .send({ ...createdItem, role: null })
      .then(response => {
        createdItemId = response.body.id;
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource (role type)', done => {
    supertest(app)
      .post('/users')
      .set('content-type', 'application/json')
      .send({ ...createdItem, role: 1 })
      .then(response => {
        createdItemId = response.body.id;
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource (role empty)', done => {
    supertest(app)
      .post('/users')
      .set('content-type', 'application/json')
      .send({ ...createdItem, role: '' })
      .then(response => {
        createdItemId = response.body.id;
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
});

describe('PATCH /users/:id', () => {
  const originalItem = {
    email: 'john@ynov.com',
    password: 'pwd',
    role: 'contributor',
  };
  let originalItemId;

  beforeEach(done => {
    supertest(app)
      .post('/users')
      .set('content-type', 'application/json')
      .send(originalItem)
      .then(response => {
        originalItemId = response.body.id;
      })
      .then(done);
  });
  afterEach(done => {
    if (originalItemId) {
      supertest(app).delete(`/users/${originalItemId}`).catch().finally(done);
    } else {
      done();
    }
  });

  it('should send a success response with full resource', done => {
    const updatedItem = {
      email: 'jane@ynov.com',
      password: 'dwp',
      role: 'admin',
    };

    supertest(app)
      .patch(`/users/${originalItemId}`)
      .set('content-type', 'application/json')
      .send(updatedItem)
      .then(response => {
        expect(response.status).toBe(200);
      })
      .then(done)
      .catch(done);
  });
  it('should send a success response with partial resource (email)', done => {
    const updatedItem = {
      email: 'jane@ynov.com',
    };

    supertest(app)
      .patch(`/users/${originalItemId}`)
      .set('content-type', 'application/json')
      .send(updatedItem)
      .then(response => {
        expect(response.status).toBe(200);
        expect(response.body.email).toBe('jane@ynov.com');
      })
      .then(done)
      .catch(done);
  });
  it('should send a success response with partial resource (password)', done => {
    const updatedItem = {
      password: 'dwp',
    };
    supertest(app)
      .patch(`/users/${originalItemId}`)
      .set('content-type', 'application/json')
      .send(updatedItem)
      .then(response => {
        expect(response.status).toBe(200);
        expect(response.body.password).not.toBeDefined();
      })
      .then(done)
      .catch(done);
  });
  it('should send a success response with partial resource (role)', done => {
    const updatedItem = {
      role: 'admin',
    };
    supertest(app)
      .patch(`/users/${originalItemId}`)
      .set('content-type', 'application/json')
      .send(updatedItem)
      .then(response => {
        expect(response.status).toBe(200);
        expect(response.body.role).toBe('admin');
      })
      .then(done)
      .catch(done);
  });
  it('should send a response with structured item', done => {
    const updatedItem = {
      email: 'jane@ynov.com',
    };

    supertest(app)
      .patch(`/users/${originalItemId}`)
      .set('content-type', 'application/json')
      .send(updatedItem)
      .then(response => {
        const item  = response.body;
        expect(item).toHaveProperty('id');
        expect(item).toHaveProperty('email');
        expect(item).toHaveProperty('role');
        expect(item).not.toHaveProperty('password');
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource id (negative)', done => {
    const updatedItem = {
      date: '2017-08-03T21:00:00.000+01:00',
    };

    supertest(app)
      .patch('/users/-1')
      .set('content-type', 'application/json')
      .send(updatedItem)
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource id (not positive)', done => {
    const updatedItem = {
      date: '2017-08-03T21:00:00.000+01:00',
    };

    supertest(app)
      .patch('/users/0')
      .set('content-type', 'application/json')
      .send(updatedItem)
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource id (type)', done => {
    const updatedItem = {
      date: '2017-08-03T21:00:00.000+01:00',
    };

    supertest(app)
      .patch('/users/xyz')
      .set('content-type', 'application/json')
      .send(updatedItem)
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource (email null)', done => {
    const updatedItem = {
      email: null,
    };

    supertest(app)
      .patch(`/users/${originalItemId}`)
      .set('content-type', 'application/json')
      .send(updatedItem)
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource (email type)', done => {
    const updatedItem = {
      email: 1,
    };

    supertest(app)
      .patch(`/users/${originalItemId}`)
      .set('content-type', 'application/json')
      .send(updatedItem)
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource (email empty)', done => {
    const updatedItem = {
      email: '',
    };

    supertest(app)
      .patch(`/users/${originalItemId}`)
      .set('content-type', 'application/json')
      .send(updatedItem)
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource (password null)', done => {
    const updatedItem = {
      password: null,
    };

    supertest(app)
      .patch(`/users/${originalItemId}`)
      .set('content-type', 'application/json')
      .send(updatedItem)
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource (password type)', done => {
    const updatedItem = {
      password: 1,
    };

    supertest(app)
      .patch(`/users/${originalItemId}`)
      .set('content-type', 'application/json')
      .send(updatedItem)
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource (password empty)', done => {
    const updatedItem = {
      password: '',
    };

    supertest(app)
      .patch(`/users/${originalItemId}`)
      .set('content-type', 'application/json')
      .send(updatedItem)
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource (role null)', done => {
    const updatedItem = {
      role: null,
    };

    supertest(app)
      .patch(`/users/${originalItemId}`)
      .set('content-type', 'application/json')
      .send(updatedItem)
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource (role type)', done => {
    const updatedItem = {
      role: 1,
    };

    supertest(app)
      .patch(`/users/${originalItemId}`)
      .set('content-type', 'application/json')
      .send(updatedItem)
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource (role empty)', done => {
    const updatedItem = {
      role: '',
    };

    supertest(app)
      .patch(`/users/${originalItemId}`)
      .set('content-type', 'application/json')
      .send(updatedItem)
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of not found item', done => {
    const updatedItem = {
      date: '2017-08-03T21:00:00.000+01:00',
    };

    supertest(app)
      .patch(`/users/${nonExistentId}`)
      .set('content-type', 'application/json')
      .send(updatedItem)
      .then(response => {
        expect(response.status).toBe(404);
      })
      .then(done)
      .catch(done);
  });
});

describe('PUT /users/:id', () => {
  const originalItem = {
    email: 'john@ynov.com',
    password: 'pwd',
    role: 'contributor',
  };
  const updatedItem = {
    email: 'jane@ynov.com',
    password: 'dwp',
    role: 'admin',
  };
  let originalItemId;

  beforeEach(done => {
    supertest(app)
      .post('/users')
      .set('content-type', 'application/json')
      .send(originalItem)
      .then(response => {
        originalItemId = response.body.id;
      })
      .then(done);
  });
  afterEach(done => {
    if (originalItemId) {
      supertest(app).delete(`/users/${originalItemId}`).catch().finally(done);
    } else {
      done();
    }
  });

  it('should send a success response', done => {
    supertest(app)
      .put(`/users/${originalItemId}`)
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
      .put(`/users/${originalItemId}`)
      .set('content-type', 'application/json')
      .send(updatedItem)
      .then(response => {
        const item  = response.body;
        expect(item).toHaveProperty('id');
        expect(item).toHaveProperty('email');
        expect(item).toHaveProperty('role');
        expect(item).not.toHaveProperty('password');
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource id (negative)', done => {
    supertest(app)
      .put('/users/-1')
      .set('content-type', 'application/json')
      .send(updatedItem)
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource id (not positive)', done => {
    supertest(app)
      .put('/users/0')
      .set('content-type', 'application/json')
      .send(updatedItem)
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource id (type)', done => {
    supertest(app)
      .put('/users/xyz')
      .set('content-type', 'application/json')
      .send(updatedItem)
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource (email missing)', done => {
    supertest(app)
      .put(`/users/${originalItemId}`)
      .set('content-type', 'application/json')
      .send({ ...updatedItem, email: undefined })
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource (email null)', done => {
    supertest(app)
      .put(`/users/${originalItemId}`)
      .set('content-type', 'application/json')
      .send({ ...updatedItem, email: null })
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource (email type)', done => {
    supertest(app)
      .put(`/users/${originalItemId}`)
      .set('content-type', 'application/json')
      .send({ ...updatedItem, email: 1 })
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource (email empty)', done => {
    supertest(app)
      .put(`/users/${originalItemId}`)
      .set('content-type', 'application/json')
      .send({ ...updatedItem, email: '' })
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource (password missing)', done => {
    supertest(app)
      .put(`/users/${originalItemId}`)
      .set('content-type', 'application/json')
      .send({ ...updatedItem, password: undefined })
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource (password null)', done => {
    supertest(app)
      .put(`/users/${originalItemId}`)
      .set('content-type', 'application/json')
      .send({ ...updatedItem, password: null })
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource (password type)', done => {
    supertest(app)
      .put(`/users/${originalItemId}`)
      .set('content-type', 'application/json')
      .send({ ...updatedItem, password: 1 })
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource (password empty)', done => {
    supertest(app)
      .put(`/users/${originalItemId}`)
      .set('content-type', 'application/json')
      .send({ ...updatedItem, password: '' })
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource (role missing)', done => {
    supertest(app)
      .put(`/users/${originalItemId}`)
      .set('content-type', 'application/json')
      .send({ ...updatedItem, role: undefined })
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource (role null)', done => {
    supertest(app)
      .put(`/users/${originalItemId}`)
      .set('content-type', 'application/json')
      .send({ ...updatedItem, role: null })
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource (role type)', done => {
    supertest(app)
      .put(`/users/${originalItemId}`)
      .set('content-type', 'application/json')
      .send({ ...updatedItem, role: 1 })
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource (role empty)', done => {
    supertest(app)
      .put(`/users/${originalItemId}`)
      .set('content-type', 'application/json')
      .send({ ...updatedItem, role: '' })
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of not found item', done => {
    supertest(app)
      .put(`/users/${nonExistentId}`)
      .set('content-type', 'application/json')
      .send(updatedItem)
      .then(response => {
        expect(response.status).toBe(404);
      })
      .then(done)
      .catch(done);
  });
});

describe('DELETE /users/:id', () => {
  const originalItem = {
    email: 'john@ynov.com',
    password: 'pwd',
    role: 'contributor',
  };
  let createdItemId;

  beforeEach(done => {
    supertest(app)
      .post('/users')
      .set('content-type', 'application/json')
      .send(originalItem)
      .then(response => {
        createdItemId = response.body.id;
      })
      .then(done);
  });
  afterEach(done => {
    if (createdItemId) {
      supertest(app).delete(`/users/${createdItemId}`).catch().finally(done);
    } else {
      done();
    }
  });

  it('should send a success response', done => {
    supertest(app)
      .delete(`/users/${createdItemId}`)
      .then(response => {
        expect(response.status).toBe(204);
      })
      .then(done)
      .catch(done);
  });
  it('should send an empty response', done => {
    supertest(app)
      .delete(`/users/${createdItemId}`)
      .then(response => {
        expect(response.text).toBe('');
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource id (negative)', done => {
    supertest(app)
      .delete('/users/-1')
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource id (not positive)', done => {
    supertest(app)
      .delete('/users/0')
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of bad resource id (type)', done => {
    supertest(app)
      .delete('/users/xyz')
      .then(response => {
        expect(response.status).toBe(400);
      })
      .then(done)
      .catch(done);
  });
  it('should send an error response because of not found item', done => {
    supertest(app)
      .delete(`/users/${nonExistentId}`)
      .then(response => {
        expect(response.status).toBe(404);
      })
      .then(done)
      .catch(done);
  });
});
