const logger = require('../modules/logger');

module.exports = function(err, req, res, next) {
    // log the error
    // params (error-message, metadata[optional])
    logger.error(err.message, err);
    console.log('ERROR caught and logged...');
    
    // 500: Internal Server Error
    res.status(500).send('Error processing the request.');
}