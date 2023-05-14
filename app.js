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
// app.use('/*', (req, res) => {
//   res.status(404)
//     .send({ message: '404: страница не найдена' });
// });

// app.use(auth);

app.use('/users', routesUser);
app.use('/cards', routesCard);

app.use((err, req, res, next) => {
  if (err.status) {
    console.log(err.message);
    return res.status(err.status).send(err.message);
  }
  res.status(500).send({ message: `На сервере произошла ошибка: ${err.message}` });
  return next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
