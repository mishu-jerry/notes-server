const { User } = require('../../../models/user');
const authorizeUser = require('../../../middleware/authorizeUser');
const ObjectId = require('mongoose').Types.ObjectId;

describe('authorizeUser middleware', () => {

    it('should set req.user with the payload of authToken if it is valid', () => {

        const user = { _id: new ObjectId(), isAdmin: true };

        const req = {
            cookies: { authToken: new User(user).generateAuthToken() }
        };
        const res = {
            status: (statusCode) => {
                return {
                    send: (message) => {
                        res.status = statusCode;
                        res.message = message;
                    }
                }
            }
        };
        const next = () => { };

        authorizeUser(req, res, next);

        expect(req.user._id).toBe(user._id.toHexString());
        expect(req.user.isAdmin).toBe(user.isAdmin);
    });
});