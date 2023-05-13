const User = require('../models/user');
const bcrypt = require('bcryptjs');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => res.status(500)
      .send({ message: err.message }));
};

module.exports.createUser = (req, res) => {
  const {
    // name,
    //  about,
    // avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
    }))
    .then((user) => res.status(201)
      .send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400)
          .send({ message: 'Invalid data to create user' });
      } else {
        res.status(500)
          .send({ message: err.message });
      }
    });
};

module.exports.getUserById = (req, res) => {
  const { userId } = req.params;
  User
    .findById(userId)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400)
          .send({ message: 'Bad Request' });
      }

      if (err.name === 'DocumentNotFoundError') {
        return res.status(404)
          .send({ message: 'User with _id cannot be found' });
      }

      return res.status(500)
        .send({ message: err.message });
    });
};

module.exports.updateUser = (req, res) => {
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
        return res.status(404)
          .send({ message: 'User with _id cannot be found' });
      }

      return res.status(500)
        .send({ message: err.message });
    });
};

module.exports.updateUserAvatar = (req, res) => {
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
        return res.status(404)
          .send({ message: 'User with _id cannot be found' });
      }

      return res.status(500)
        .send({ message: err.message });
    });
};
