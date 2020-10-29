const {
    createLogger,
    transports,
    format
} = require('winston');

require('winston-mongodb');

exports.error = createLogger({
    format: format.combine(format.timestamp(), format.json()),
    level: 'error',
    transports: [
        new transports.File({
            filename: './logs/error.log'
        }),
        new transports.MongoDB({
            db: 'mongodb://localhost/notes-app',
            options: { useUnifiedTopology: true },
            collection: 'errors'
        }),
        /* only for developement environment */
        new (transports.Console)({
            format: format.combine(format.colorize(), format.prettyPrint())
        })
    ]
});

exports.info = createLogger({
    format: format.combine(format.timestamp(), format.json()),
    level: 'info',
    transports: [
        new transports.File({
            filename: './logs/info.log'
        }),
        new transports.MongoDB({
            db: 'mongodb://localhost/notes-app',
            options: { useUnifiedTopology: true },
            collection: 'info'
        }),
        new transports.Console({
            format: format.simple()
        })
    ]
});

/**
 * Winston documentation
 * @url https://www.npmjs.com/package/winston
 */