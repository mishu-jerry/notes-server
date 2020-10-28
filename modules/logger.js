const {
    createLogger,
    transports,
    format
} = require('winston');

require('winston-mongodb');

module.exports = createLogger({
    format: format.combine(format.timestamp(), format.json()),
    transports: [
        new transports.File({
            level: 'error', // 0
            filename: './logs/error.log'
        }),
        new transports.MongoDB({
            level: 'error', // 0
            db: 'mongodb://localhost/notes-app',
            options: { useUnifiedTopology: true },
            collection: 'errors'
        }),
        new transports.File({
            level: 'http', // 3
            filename: './logs/http.log'
        }),
        new transports.File({
            level: 'verbose', // 4
            filename: './logs/verbose.log'
        }),
        new transports.File({
            level: 'debug', // 5
            filename: './logs/debug.log'
        })
    ]
});

/**
 * Winston documentation
 * @url https://www.npmjs.com/package/winston
 */