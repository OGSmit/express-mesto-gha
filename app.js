const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { Joi, celebrate, errors } = require('celebrate');
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

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().pattern(/^[a-zA-Z0-9]{3,30}$/),
  }),
}), createUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email(),
    password: Joi.string().pattern(/^[a-zA-Z0-9]{3,30}$/),
  }),
}), login);

app.use('/users', auth, routesUser);
app.use('/cards', auth, routesCard);
app.use('/*', (req, res) => {
  res.status(404)
    .send({ message: '404: страница не найдена' });
});
app.use(errors());
app.use((err, req, res, next) => {
  const regExp = /\d{3}/;
  const craftStatusCode = err.message.match(regExp);
  if (craftStatusCode) {
    return res.status(craftStatusCode).send({ message: err.message });
  }

  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  return next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
