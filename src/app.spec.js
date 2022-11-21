import supertest from 'supertest';
import { app } from './app.js';

const nonExistentId = Number.MAX_SAFE_INTEGER;

describe('GET /hello world', () => {
    it('should send a success response with hello world message', done => {
        supertest(app)
            .get(`/`)
            .then(response => {
                expect(response.status).toBe(200);
                expect(response.body.message).toBe('hello world');
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

describe('GET /live-scores/1', () => {
    it('should send a success response', done => {
        supertest(app)
            .get('/live-scores/1')
            .then(response => {
                expect(response.status).toBe(200);
            })
            .then(done)
            .catch(done);
    });
    it('should send a response with structured item', done => {
        supertest(app)
            .get('/live-scores/1')
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
                expect(response.body.date).toBe('2017-08-03T21:00:00.000+01:00');
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
