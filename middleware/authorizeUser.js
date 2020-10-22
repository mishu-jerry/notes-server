/**
 * Middleware Function to Authorize User
 * 
 * Check if the client is Authorized (logged in and has permissions),
 * if yes, pass control to the next middleware
 * 
 * The function expects 'x-auth-token' header with the Request object,
 * does authorization with the token provided,
 * if successful, add the user's id (from the JWT payload) as _id field
 * to the Request header (req.user._id)
 */

const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
    const token = req.header('x-auth-token');
    // 401: Unauthorized
    if (!token) return res.status(401).send('Access denied. No token provided.');

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