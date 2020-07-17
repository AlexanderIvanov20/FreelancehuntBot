const { Schema, model } = require('mongoose');

/* Describe user's schema of the collection */
const schema = new Schema({
  userId: {
    type: Number,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
  },
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
  },
  ids: {
    type: Array,
  },
}, { collection: 'users' });

module.exports = model('User', schema);
