const express = require('express');
const bodyParser = require('body-parser');
const { mongoose } = require('./db/mongoose');
const wordLists = require('./routes/wordLists');
const userAuth = require('./routes/userAuth');

const app = express();

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
  console.log('connected');
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.listen(5000, () => console.log('Listening on port 5000'));

app.use(express.static('dist'));
app.use('/api', userAuth);
app.use('/api/wordLists', wordLists);

app.get('/express_backend', (req, res) => {
  console.log(req);
  res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' });
});
