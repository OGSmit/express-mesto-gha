
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routesUser = require('./routes/user');
const routesCard = require('./routes/card');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  req.user = {
    _id: '6454c9f8093db9a4f3ef080a'
  };
  next();
});

app.use('/users', routesUser);
app.use('/cards', routesCard);
app.use('/*', (req, res) => {
  res.status(404)
    .send({ message: '404: Not Found' });
});


app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
})