// For MongoDB models and schemas
const mongoose = require('mongoose');
// For validation
const joi = require('joi');

/* Valid Options */
const titleMaxLength = 50;
const noteMaxLength = 1000;

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        default: 'Untitled',
        maxlength: titleMaxLength
    },
    note: {
        type: String,
        required: true,
        maxlength: noteMaxLength
    },
    userId: {
        type: String,
        required: true
    }
}, { timestamps: true });

/**
 * (Some) Options of Mongoose Schema (Optional)
 * 
 * timestamps: adds createdAt and updatedAt properties. 
 * These are updated automatically by Mongoose
 * 
 * collection: name of the collection. If not specified, Mongoose uses
 * a pluralized and lower cased name of the model name 
 * (e.g. model name: Note, collection name: notes)
 * The collection name can also be set by passing a name (string) as 
 * the 3rd arg in the mongoose.model() method.
 * 
 * =====
 * 
 * Disable automatic pluralization and lowercasing of the collection name
 * mongoose.pluralize(null);
 */

// Create Note model
const Note = mongoose.model('Note', noteSchema);

function validate(note) {

    const schema = joi.object({
        title: joi.string().max(titleMaxLength),
        note: joi.string().max(noteMaxLength).required()
    });

    return schema.validate(note);
}

exports.Note = Note;
exports.validate = validate;