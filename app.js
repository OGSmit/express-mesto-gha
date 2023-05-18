const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { Joi, celebrate, errors } = require('celebrate');
const routesUser = require('./routes/user');
const routesCard = require('./routes/card');
const auth = require('./middlewares/auth');
const { createUser, login } = require('./controllers/user');
const NotFoundError = require('./error/not-found-error');
const NoStatusError = require('./error/no-status-error');

const { PORT = 3000 } = process.env;

const app = express();
app.use(helmet());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/^(https?|ftp|file):\/\/[-a-zA-Z0-9+&@#/%?=~_|!:,.;]*[-a-zA-Z0-9+&@#/%=~_|]/),
    email: Joi.string().required().email(),
    password: Joi.string().required().pattern(/^[a-zA-Z0-9]{3,30}$/),
  }),
}), createUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().pattern(/^[a-zA-Z0-9]{3,30}$/),
  }),
}), login);

app.use('/users', auth, routesUser);
app.use('/cards', auth, routesCard);

app.use('/*', () => {
  throw new NotFoundError('Страница не найдена');
});

app.use(errors());

app.use((err, req, res, next) => {
  if (err.code === 11000) {
    throw new NoStatusError(409, 'пользователь с таким email - существует');
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
