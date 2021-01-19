const { User } = require('../models/user');
const Joi = require('joi'); // For Validation
const bcrypt = require('bcrypt'); // For encryption / hashing
const express = require('express');
const router = express.Router();

// Valid options
const emailMinLength = 5;
const emailMaxLength = 255;
const passMinLength = 5;
const passMaxLength = 255;

// Login
router.post('/', async (req, res) => {

    let { error } = validate(req.body);
    // 400: Bad Request
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Email or Password is incorrect.');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Email or Password is incorrect.');

    const token = user.generateAuthToken();
    
    // attach the token with cookie
    res.cookie('authToken', token, {
        maxAge: 2592000, // 1 month
        httpOnly: true
    }).send();
});

function validate(req) {

    const schema = Joi.object({
        email: Joi.string().min(emailMinLength).max(emailMaxLength).required().email(),
        password: Joi.string().min(passMinLength).max(passMaxLength).required()
    });

    return schema.validate(req);
}

module.exports = router;