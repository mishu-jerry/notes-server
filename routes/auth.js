/**
 * Authentication Router
 * 
 * Login (Verify login credentials i.e. email, password) 
 * and send an Authenticaion Token (JWT) / Access credential
 * to the client
 */

const { User } = require('../models/user');
const Joi = require('joi'); // For Validation
const bcrypt = require('bcrypt'); // For encryption / hashing
const express = require('express');
const router = express.Router();

/* Valid options */
const emailMinLength = 5;
const emailMaxLength = 255;
const passMinLength = 5;
const passMaxLength = 255;

// Login (with email and password in the request body) and
// get an Auth Token (JWT)
router.post('/', async (req, res) => {

    // Validation of inputs
    let { error } = validate(req.body);
    // Status 400: Bad Request
    if (error) return res.status(400).send(error.details[0].message);

    // Search for an existing user with the entered email
    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Email or Password is incorrect.');

    // Check if the entered password is correct
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Email or Password is incorrect.');

    // Generate a JSON Web Token
    const token = user.generateAuthToken();

    // Send the token with the response body to the client
    res.send(token);
});

function validate(req) {

    const schema = Joi.object({
        email: Joi.string().min(emailMinLength).max(emailMaxLength).required().email(),
        password: Joi.string().min(passMinLength).max(passMaxLength).required()
    });

    return schema.validate(req);
}

module.exports = router;