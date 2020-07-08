const { Schema, model } = require('mongoose');

const schema = new Schema({
    title: {
        type: String,
        required: true
    },
    projectId: {
        type: Number,
        required: true,
        unique: true
    }
});

module.exports = model('Project', schema);