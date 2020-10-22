const jwt = require('jsonwebtoken');
const config = require('config');
// For Validation
const joi = require('joi');
const passwordComplexity = require("joi-password-complexity");
// For MongoDB models and schemas
const mongoose = require('mongoose');

/* Valid options */
const nameMinLength = 5;
const nameMaxLength = 55;
const emailMinLength = 5;
const emailMaxLength = 255;
const passMinLength = 5;
const passMaxLength = 255;
const passHashedMaxLength = 1024;

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: nameMinLength,
        maxlength: nameMaxLength
    },
    email: {
        type: String,
        required: true,
        minlength: emailMinLength,
        maxlength: emailMaxLength,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: passMinLength,
        maxlength: passHashedMaxLength
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});

userSchema.methods.generateAuthToken = function () {

    const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin },
        config.get('jwtPrivateKey'));

    return token;
}

const passwordComplexityOptions = {
    min: passMinLength,
    max: passMaxLength,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 1,
    requirementCount: 4,
};

// Create User model
const User = mongoose.model('User', userSchema);

function validate(user) {

    const schema = joi.object({
        name: joi.string().min(nameMinLength).max(nameMinLength).required(),
        email: joi.string().min(emailMinLength).max(emailMaxLength).required().email(),
        password: passwordComplexity(passwordComplexityOptions, "Password")
    });

    return schema.validate(user);
}

exports.User = User;
exports.validate = validate;