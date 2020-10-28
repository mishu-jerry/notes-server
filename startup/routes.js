const express = require('express');
const cookieParser = require('cookie-parser');
const usersRouter = require('../routes/users');
const authRouter = require('../routes/auth');
const notesRouter = require('../routes/notes');
const error = require('../middleware/error');

module.exports = function (app) {

    app.use(express.json());
    app.use(cookieParser());

    // Homepage
    app.get('/', function (req, res) {
        res.send('<h1>Hello, Note App User!</h1>\
        <p>Please use the REST APIs for using the service</p>');
    });

    app.use('/api/users', usersRouter);
    app.use('/api/auth', authRouter);
    app.use('/api/notes', notesRouter);

    app.use(error);
}