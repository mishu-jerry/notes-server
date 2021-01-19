// express-async-error module calls next(err) 
// [next express middleware] automatically when 
// an exception is thrown from an express middleware
require('express-async-errors');
const config = require('config');

const { error, info } = require('../modules/logger');

module.exports = function () {
    // process is a global object (Node.js event emitter)
    process.on('uncaughtException', (ex) => {
        error.error(ex.message, ex);
        console.error('*** ERROR caught and logged');
    });
    
    // catch Unhandled Promise Rejection, throw exception
    process.on('unhandledRejection', (ex) => {
        throw ex;
    });

    process.on('serverStartup', () => {
        info.info('Server started');
    });

    process.on('mongoDBConnection', () => {
        info.info(`MongoDB connected to ${config.get('db')}`);
    });
}