// express-async-error module calls next(err) 
// [next express middleware] automatically when 
// an exception is thrown
require('express-async-errors');

const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const notesRouter = require('./routes/notes');
const error = require('./middleware/error');
const mongoose = require('mongoose');
const config = require('config');
const cookieParser = require('cookie-parser');
const express = require('express');

const app = express();

if (!config.get('jwtPrivateKey')) {

    console.log('FATAL ERROR: jwtPrivateKey is not defined.');
    // Terminate this node program (index.js)
    process.exit(1);

    /**
     * Create an environment variable that is local to the 
     * current Windows PowerShell session:
     * 
     * >> $env:varName = 'value'
     * 
     * See the required Environment Variable name in-
     * @path ./config/custom-environment-variables.json
     */
}

mongoose.connect('mongodb://localhost/notes-app', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

app.use(express.json());
app.use(cookieParser());
app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);
app.use('/api/notes', notesRouter);

app.use(error);

app.get('/', function (req, res) {

    const welcomeMsg = '<h1>Hello, Note App User!</h1>\
        <p>Please use REST APIs to login and access your notes</p>';

    res.send(welcomeMsg);
});

let server = app.listen(8081, function () {
    let host = server.address().address;
    let port = server.address().port;

    console.log("Notes App Server running at http://%s:%s"
        + "\n=======", host, port);
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