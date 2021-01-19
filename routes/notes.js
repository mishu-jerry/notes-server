const auth = require('../middleware/authorizeUser');
const isValidObjectId = require('../middleware/isValidObjectId');
const { Note, validate } = require('../models/note');
const _ = require('lodash');
const express = require('express');
const router = express.Router();

router.get('/', auth, async (req, res) => {
    const notes = await Note.find({ userId: req.user._id }).select('-userId');
    res.send(notes); // status 200 is sent automatically
});

router.get('/:id', [auth, isValidObjectId], async (req, res) => {

    const note = await Note.findById(req.params.id);

    if (!note || note.userId != req.user._id) {
        // 404: Not Found
        return res.status(404).send(`The note doesn't exist or you don't have access to it.`);
    }

    res.send(_.pick(note, ['_id', 'title', 'note', 'createdAt', 'updatedAt']));
});

router.post('/', auth, async (req, res) => {

    let { error } = validate(req.body);
    // 400: Bad Request
    if (error) return res.status(400).send(error.details[0].message);

    const note = new Note(_.pick(req.body, ['title', 'note']));
    note.userId = req.user._id;

    const addedNote = await note.save();
    res.send(_.pick(addedNote, ['_id', 'title', 'note', 'createdAt']));
});

router.put('/:id', [auth, isValidObjectId], async (req, res) => {

    const note = await Note.findById(req.params.id);

    if (!note || note.userId != req.user._id) {
        // 404: Not Found
        return res.status(404).send(`The note doesn't exist or you don't have access to it.`);
    }

    if (req.body.title) note.title = req.body.title;
    if (req.body.note) note.note = req.body.note;

    let { error } = validate({
        title: note.title,
        note: note.note
    });

    // 400: Bad Request
    if (error) return res.status(400).send(error.details[0].message);

    const updatedNote = await note.save();
    res.send(_.pick(updatedNote, ['_id', 'title', 'note', 'updateAt']));
});

router.delete('/:id', [auth, isValidObjectId], async (req, res) => {
    const note = await Note.findById(req.params.id);

    if (!note || note.userId != req.user._id) {
        // 404: Not Found
        return res.status(404).send(`The note doesn't exist or you don't have access to it.`);
    }

    await note.remove();
    res.send(_.pick(note, ['_id', 'title', 'note', 'createdAt', 'updatedAt']));
});

router.delete('/', auth, async (req, res) => {

    const result = await Note.deleteMany({ userId: req.user._id });
    // 404: Not Found
    if (result.deletedCount === 0) return res.status(404).send(`You don't have any notes.`);

    res.send(`Deleted ${result.deletedCount} note(s).`);
});

module.exports = router;