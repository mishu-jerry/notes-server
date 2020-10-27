/**
 * Wraps the 'handler' middlware function with try-catch block.
 * 
 * Helps to avoid writing try-catch blocks in the middlewares
 * functions. Useful for writting a cleaner code.
 * 
 * ----------------------------------------------
 * const asyncMiddlware = require('async');
 * 
 * asyncMiddleware(async (req, res, next) => {
 * 
 *   // Do something (throws exception)
 *   // Don't need to use try-catch, next(err), they will be
 *   // handled by asyncMiddleware()
 * 
 * });
 * ----------------------------------------------
 */

module.exports = function (handler) {
    return async (req, res, next) => {
        try {
            await handler(req, res);
        }
        catch (ex) {
            next(ex);
        }
    };
}