const { User, validate } = require('../models/user');
const auth = require('../middleware/authorizeUser');
const admin = require('../middleware/authorizeAdmin');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();

router.get('/me', auth, async (req, res) => {

    const user = await User.findById(req.user._id)
        // exclude the password field
        .select('-password');

    res.send(user);
});

// sign up
router.post('/', async (req, res) => {

    let { error } = validate(req.body);
    // 400: Bad Request
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('User already registered.');

    user = new User(_.pick(req.body, ['name', 'email', 'password']));

    // Hash user's password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();

    const token = user.generateAuthToken();

    res.header('x-auth-token', token).send(_.pick(user, ['id', 'name', 'email']));
});

router.delete('/:id', [auth, admin], async (req, res) => {

    const reqUser = await User.findById(req.user._id);
    if (!reqUser.isAdmin) {
        // 403: Forbidden
        return res.status(403).send('Access denied. You are not an admin.');
    }

    // 403: Forbidden
    if (reqUser._id === req.params.id) return res.status(403).send('Cannot delete yourself.');

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

router.post('/makeadmin/:id', [auth, admin], async (req, res) => {

    const reqUser = await User.findById(req.user._id);
    if (!reqUser.isAdmin) {
        // 403: Forbidden
        return res.status(403).send('Access denied. You are not an admin.');
    }

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

router.post('/removeadmin/:id', [auth, admin], async (req, res) => {

    const reqUser = await User.findById(req.user._id);
    if (!reqUser.isAdmin) {
        // 403: Forbidden
        return res.status(403).send('Access denied. You are not an admin.');
    }

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

// Delete an admin user-
// step 1: Remove admin access of the user (post '/removeadmin/:id')
// step 2: Delete the user (delete '/:id')

module.exports = router;