const winston = require('winston');

exports.error = winston.createLogger({
    level: 'error', // 0
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: './logs/error.log' })
    ]
});

exports.http = winston.createLogger({
    level: 'http', // 3
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: './logs/http.log' })
    ]
});

exports.verbose = winston.createLogger({
    level: 'verbose', // 4
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: './logs/verbose.log' })
    ]
});

exports.debug = winston.createLogger({
    level: 'debug', // 5
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: './logs/debug.log' })
    ]
});

/**
 * Winston documentation
 * @url https://www.npmjs.com/package/winston
 */