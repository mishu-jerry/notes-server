/**
 * Middleware Function to Authorize User
 * 
 * Check if the client is Authorized (logged in and has permissions),
 * if yes, pass control to the next middleware
 * 
 * The function expects 'authToken' field in Cookie with the Request object,
 * does authorization with the token provided,
 * if successful, adds the user's { _id, isAdmin } (from the JWT payload)
 * to the Request header (req.user._id, req.user.isAdmin)
 */

const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
    const token = req.cookies.authToken;

    // 401: Unauthorized
    if (!token) return res.status(401).send('Access denied. \
        Not logged in (No token provided).');

    try {
        const decodedPayload = jwt.verify(token, config.get('jwtPrivateKey'));

        // Add the Payload to Request Header
        // The Payload (of this server's JWT) contains the user's _id, isAdmin
        // i.e. { _id: string, isAdmin: boolean }
        req.user = decodedPayload;

        // User is authorized. Pass control (grant access) to the next middleware.
        next();
    }
    catch (ex) {
        // Token verification failed
        // 400: Bad Request
        res.status(400).send('Invalid token.');
    }
}