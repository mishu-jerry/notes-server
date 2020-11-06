const { User, validate } = require('../../../models/user');
const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');

describe('user.generateAuthToken', () => {
    it('should return a valid JWT', () => {
        const payload = {
            _id: new mongoose.Types.ObjectId().toHexString(),
            isAdmin: true
        };

        const user = new User(payload);
        const token = user.generateAuthToken();

        // console.log('using private key: ' + config.get('jwtPrivateKey'));
        const decodedToken = jwt.verify(token, config.get('jwtPrivateKey'));

        expect(decodedToken).toMatchObject(payload);
    });
});