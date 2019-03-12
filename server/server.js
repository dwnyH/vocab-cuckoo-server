const express = require('express');
const bodyParser = require('body-parser');
const { mongoose } = require('./db/mongoose');
const wordLists = require('./routes/wordLists');

const app = express();
// const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.listen(5000, () => console.log('Listening on port 5000'));

app.use(express.static('dist'));
app.use('/api', wordLists);

app.get('/express_backend', (req, res) => {
  console.log(req);
  res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' });
});
