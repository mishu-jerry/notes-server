const { User, validate } = require('../models/user');
const auth = require('../middleware/authorizeUser');
const admin = require('../middleware/authorizeAdmin');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();

/**
 * Available methods
 * =====
 * 
 * Get the current user (get '/me')
 * Sign up / create new user (post '/')
 * Delete a general user (delete '/:id')
 * Give admin access to a general user (post '/makeadmin/:id')
 * Remove admin access from an admin user (post '/removeadmin/:id')
 * 
 * Delete an admin user-
 * step 1: Remove admin access of the user (post '/removeadmin/:id')
 * step 2: Delete the user (delete '/:id')
 */

// Get the current user
router.get('/me', auth, async (req, res) => {

    const user = await User.findById(req.user._id)
        // exclude the password field
        .select('-password');
    
    res.send(user);
});

// Sign Up / Create new user (general user)
router.post('/', async (req, res) => {
    
    // Validation of inputs
    let { error } = validate(req.body);
    // Status 400: Bad Request
    if (error) return res.status(400).send(error.details[0].message);

    // Check if user already exists
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('User already registered.');

    user = new User(_.pick(req.body, ['name', 'email', 'password']));

    // Hash user's password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();

    // Generate a JSON Web Token
    const token = user.generateAuthToken();

    // Add a new header (containing the token) to the response body
    res.header('x-auth-token', token).send(_.pick(user, ['id', 'name', 'email']));
});

// Delete a general user. The requested user must be an admin
router.delete('/:id', [auth, admin], async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');

    // 404: Not Found
    if (!user) return res.status(404).send(`User with id ${req.params.id} doesn't exist.`);

    if (user.isAdmin) {
        // 403: Forbidden
        return res.status(403).send('Access Denied. Cannot delete an admin.');
    }

    await user.remove();

    res.send(user);
});

// Give admin access to a general user. Requested user must be an admin
router.post('/makeadmin/:id', [auth, admin], async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');

    // 404: Not Found
    if (!user) return res.status(404).send(`User with id: ${req.params.id} doesn't exist.`);

    if (user.isAdmin) {
        // 400: Bad Request
        return res.status(400).send(`User with id: ${req.params.id} is already an admin.`);
    }

    user.isAdmin = true;
    user.save();    

    res.send(user);
});

// Remove admin access from an admin user. 
// The requested user must be an admin, and
// The user to remove access from is not the requested user himself.
// (so it is guarateed that there will be atleast one user with admin access)
router.post('/removeadmin/:id', [auth, admin], async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');

    // 404: Not Found
    if (!user) return res.status(404).send(`User with id: ${req.params.id} doesn't exist.`);

    if (!user.isAdmin) {
        // 400: Bad Request
        return res.status(400).send(`User with id: ${req.params.id} is not an admin.`);
    }

    user.isAdmin = false;
    user.save();    

    res.send(user);
});

module.exports = router;