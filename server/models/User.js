const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema({
  email: { type: String, required: true },
  name: String,
  id: { type: String, required: true },
  monthLists: Array,
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
