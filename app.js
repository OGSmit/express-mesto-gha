
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
    _id: '6453d79960195bdeb03badd2'
  };

  next();
});

app.use('/', routesUser);
app.use('/', routesCard);

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
})