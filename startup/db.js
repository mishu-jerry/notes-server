const mongoose = require('mongoose');

module.exports = function () {
    mongoose.connect('mongodb://localhost/notes-app', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    })
        .then(() => process.emit('mongoDBConnection'));
}