const app = require('express')();

require('./startup/logging')();
require('./startup/db')();
require('./startup/config')();
require('./startup/routes')(app);

let server = app.listen(8081, function () {

    let host = server.address().address;
    let port = server.address().port;

    console.log(`===== Server running at http://${host}:${port} =====`);

    process.emit('serverStartup');
});

/**
 * Quick start:
 * ============
 *
 * Set environment variable-
 * >> $env:notes_server_jwtPrivateKey = 'myPrivateKey'
 *
 * Start Node Monitor-
 * >> nodemon
 *
 * Or, run index.js manually-
 * >> node index.js
 *
 * Visit-
 * @url http://127.0.0.1:8081/
 */