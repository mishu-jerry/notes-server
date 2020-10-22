/**
 * Middleware Function to Authorize Admin
 * 
 * It is expected to use authorizeUser (middleware) first before
 * using this middleware (authorizeAdmin)
 */

module.exports = function(req, res, next) {
    
    // req.user.isAdmin has been set by authorizeUser middleware

    // 403: Forbidden
    if (!req.user.isAdmin) return res.status(403).send('Access denied. Not an admin.');

    next();
}