const mongoose = require('mongoose');
const { dbUser, dbPassword } = require('./credentials');

mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0-72aic.mongodb.net/test?retryWrites=true`, { useNewUrlParser: true }, (err) => {
  if (err) {
    console.log(err);
  }
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function() {
  console.log('connected');
});

module.exports = {
  mongoose,
};
