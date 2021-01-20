const request = require('supertest');
const { User } = require('../../../models/user');

describe('authorizeUser middleware', () => {

    let server, authToken;

    beforeEach(async () => {
        server = require('../../../index');
        authToken = new User().generateAuthToken();
    });

    afterEach(async () => {
        server.close();
    });

    function execReq() {
        return request(server)
            .get('/api/notes')
            .set('Cookie', `authToken=${authToken}`);
    }

    it('should return 401 if no authToken is provided', async () => {
        authToken = '';
        const res = await execReq();
        expect(res.statusCode).toBe(401);
    });

    it('should return 400 if authToken is invalid', async () => {
        authToken = 'a';
        const res = await execReq();
        expect(res.statusCode).toBe(400);
    });

    it('should return 200 if authToken is valid', async () => {
        const res = await execReq();
        expect(res.statusCode).toBe(200);
    });
});