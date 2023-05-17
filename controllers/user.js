const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../error/not-found-error');
const BadRequestError = require('../error/bad-request');
const NoStatusError = require('../error/no-status-error');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then(() => res.status(201)
      .send({
        name,
        about,
        avatar,
        email,
      }))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  const { userId } = req.params;
  User
    .findById(userId).select('+password')
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Bad Rrequest');
      }

      if (err.name === 'DocumentNotFoundError') {
        throw new NotFoundError({ message: 'пользователь с таким id - отсутствует' });
      }

      return res.status(500)
        .send({ message: err.message });
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const {
    name,
    about,
  } = req.body;

  User
    .findByIdAndUpdate(
      req.user._id,
      {
        name,
        about,
      },
      {
        new: true,
        runValidators: true,
      },
    )
    .orFail()
    .then((user) => res.status(200)
      .send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        throw new BadRequestError('с запросом что-то не так');
      }

      if (err.name === 'DocumentNotFoundError') {
        throw new NotFoundError('пользователь с таким id - отсутствует');
      }

      throw new NoStatusError('Что-то пошло не так');
    })
    .catch(next);
};

module.exports.updateUserAvatar = (req, res, next) => {
  const {
    avatar,
  } = req.body;

  User
    .findByIdAndUpdate(
      req.user._id,
      {
        avatar,
      },
      {
        new: true,
        runValidators: true,
      },
    )
    .then((user) => res.status(200)
      .send(user))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        throw new BadRequestError('с запросом что-то не так');
      }

      if (err.name === 'DocumentNotFoundError') {
        throw new NotFoundError('пользователь с таким id - отсутствует');
      }

      throw new NoStatusError('Что-то пошло не так');
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'super-puper-secret-key', { expiresIn: '7d' });
      res.status(200).send({ token });
    })
    .catch(next);
};

module.exports.getMe = (req, res, next) => {
  User.findById(req.user._id)
    .orFail()
    .catch(() => {
      throw new NotFoundError('пользователь с таким id - отсутствует');
    })
    .then((user) => res.send({ data: user }))
    .catch(next);
};
