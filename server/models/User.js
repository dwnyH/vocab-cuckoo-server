const mongoose = require('mongoose');

const { Schema } = mongoose;
const wordListSchema = require('./WordList');

const UserSchema = new Schema({
  email: { type: String, required: true },
  name: String,
  id: String,
  wordLists: [wordListSchema],
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
