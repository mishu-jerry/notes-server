const errorLogger = require('../modules/logger').error;

module.exports = function(err, req, res, next) {
    // log the error
    // params (error-message, metadata[optional])
    errorLogger.error(err.message, err);
    console.log('ERROR caught and logged...');
    
    // 500: Internal Server Error
    res.status(500).send('Error processing the request.');
}