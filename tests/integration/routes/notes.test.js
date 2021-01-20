const { ObjectId } = require('mongoose').Types;
const request = require('supertest');
const { Note } = require('../../../models/note');
const { User } = require('../../../models/user');

describe('/api/notes', () => {

    let server, user, note, note2, authToken;

    beforeEach(async () => {

        server = require('../../../index');

        user = new User({ name: 'aaaaa', email: 'aaaaa', password: 'aaaaa' });
        await user.save();
        note = new Note({ note: 'hello world', userId: user._id });
        await note.save();
        note2 = new Note({ note: 'hello world 2', userId: user._id });
        await note2.save();
        authToken = user.generateAuthToken();
    });

    afterEach(async () => {
        server.close();
        await Note.deleteMany();
        await User.deleteMany();
    });

    describe('GET /', () => {

        it('should return 401 if user is not logged in', async () => {
            const res = await request(server).get('/api/notes');

            expect(res.status).toBe(401);
        });

        it('should return all notes', async () => {

            const res = await request(server)
                .get('/api/notes')
                .set('Cookie', `authToken=${authToken}`);

            expect(res.status).toBe(200); // too specific
            expect(res.body.length).toBe(2); // too general
            // some() is a js array method
            expect(res.body.some(v => v.note === note.note)).toBeTruthy();
            expect(res.body.some(v => v.note === note2.note)).toBeTruthy();
        });
    });

    describe('GET /:id', () => {

        it('should return the note with the specified id', async () => {

            const res = await request(server)
                .get(`/api/notes/${note._id}`)
                .set('Cookie', `authToken=${authToken}`);

            expect(res.status).toBe(200); // too specific
            expect(res.body).toBeTruthy(); // too general
            expect(res.body._id).toMatch(note._id.toHexString());
            expect(res.body.note).toMatch(note.note);
        });

        it('should return 404 if the specified id doesn\'t exist', async () => {

            const res = await request(server)
                .get(`/api/notes/${new ObjectId()}`)
                .set('Cookie', `authToken=${authToken}`);

            expect(res.status).toBe(404);
            expect(res.error).toBeTruthy();
            expect(res.error.text).toMatch(/note doesn't exist/);
        });

        it('should return 404 (with error /Invalid ID/) if the specified id is invalid', async () => {

            const res = await request(server)
                .get(`/api/notes/${12345}`)
                .set('Cookie', `authToken=${authToken}`);

            expect(res.status).toBe(404);
            expect(res.error).toBeTruthy();
            expect(res.error.text).toMatch(/Invalid ID/);
        });
    });

    describe('POST /', () => {

        it('should return 400 if note title has more than 50 chars', async () => {

            const res = await request(server)
                .post('/api/notes')
                .set('Cookie', `authToken=${authToken}`)
                .send({ title: new Array(52).join('a'), note: 'a' });
            // title: create an array of size 51, join each element with 'a', get a str of size 51

            expect(res.status).toBe(400);
            expect(res.error).toBeTruthy();
        });

        it('should save the note in db if valid', async () => {

            const res = await request(server)
                .post('/api/notes')
                .set('Cookie', `authToken=${authToken}`)
                .send({ note: 'hello world 3' });

            const _note = await Note.findOne({ note: 'hello world 3' });
            
            expect(_note).toBeTruthy();
        });

        it('should return the note if valid', async () => {

            const res = await request(server)
                .post('/api/notes')
                .set('Cookie', `authToken=${authToken}`)
                .send({ note: 'hello world 3' });
            
            expect(res.statusCode).toBe(200);
            expect(res.body.note).toBeTruthy();
            expect(res.body.note).toBe('hello world 3');
        });
    });
});
