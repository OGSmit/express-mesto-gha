const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../error/not-found-error');
const AuthorisationError = require('../error/authorisation-error');
const NoStatusError = require('../error/no-status-error');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => res.status(500)
      .send({ message: err.message }));
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
    .then((user) => res.status(201)
      .send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new AuthorisationError({ message: err.message });
      } else {
        throw new NoStatusError({ message: err.message });
      }
    })
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
        return res.status(400)
          .send({ message: 'Bad Request' });
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
        return res.status(400)
          .send({ message: 'Invalid data to update user' });
      }

      if (err.name === 'DocumentNotFoundError') {
        throw new NotFoundError({ message: 'пользователь с таким id - отсутствует' });
      }

      return res.status(500)
        .send({ message: err.message });
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
        return res.status(400)
          .send({ message: 'Invalid data to update user' });
      }

      if (err.name === 'DocumentNotFoundError') {
        throw new NotFoundError({ message: 'пользователь с таким id - отсутствует' });
      }

      return res.status(500)
        .send({ message: err.message });
    })
    .catch(next);
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'super-puper-secret-key', { expiresIn: '7d' });

      res.send({ token });
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.params._id)
    .orFail()
    .catch(() => {
      throw new NotFoundError({ message: 'пользователь с таким id - отсутствует' });
    })
    .then((user) => res.send({ data: user }))
    .catch(next);
};
