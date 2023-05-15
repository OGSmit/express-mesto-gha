const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const routesUser = require('./routes/user');
const routesCard = require('./routes/card');
const auth = require('./middlewares/auth');
const { createUser, login } = require('./controllers/user');

const { PORT = 3000 } = process.env;

const app = express();
app.use(helmet());

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(express.static(path.join(__dirname, 'public')));
app.use(errors());

app.post('/signup', createUser);
app.post('/signin', login);

app.use(auth);

app.use('/users', routesUser);
app.use('/cards', routesCard);
app.use('/*', (req, res) => {
  res.status(404)
    .send({ message: '404: страница не найдена' });
});

app.use((err, req, res, next) => {
  const regExp = /\d{3}/;
  const craftStatusCode = err.message.match(regExp);
  if (craftStatusCode) {
    err.statusCode = craftStatusCode;
  }
  const { statusCode = 500, message } = err;
  console.log(`Центральный-..Код=${statusCode} ..Сообщение=${err.message}`);
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
