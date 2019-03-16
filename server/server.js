const express = require('express');
const bodyParser = require('body-parser');
const { mongoose } = require('./db/mongoose');
const users = require('./routes/users');
const userAuth = require('./routes/userAuth');
const authMiddleware = require('./middlewares/auth');

const app = express();

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
  console.log('connected');
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.listen(8081, () => console.log('Listening on port 8081'));

app.use(express.static('dist'));
app.use('/', userAuth);
app.use('/users', authMiddleware);
app.use('/users', users);
