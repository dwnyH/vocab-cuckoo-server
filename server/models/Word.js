const mongoose = require('mongoose');

const { Schema } = mongoose;

const WordListSchema = new Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  savedAt: String,
  savedMonth: String,
  word: { type: String, required: true },
  translated: { type: String, required: true },
});

const Word = mongoose.model('Word', WordListSchema);

module.exports = Word;
