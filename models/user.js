const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const AuthorisationError = require('../error/authorisation-error');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: [2, '400 Минимальная длина поля "name" - 2'],
      maxlength: [30, '400 Максимальная длина поля "name" - 30'],
      default: 'Жак-Ив Кусто',
    },
    about: {
      type: String,
      minlength: [2, '400 Минимальная длина поля "about" - 2'],
      maxlength: [30, '400 Максимальная длина поля "about" - 30'],
      default: 'Исследователь',
    },
    avatar: {
      type: String,
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
      validate: {
        validator: (str) => /https?:\/\/(w{3}\.)?[\w\-.~:/?#[\]@!$&'\\()*+,;=]/.test(str),
        message: '400 Не верно указан адрес',
      },
    },
    email: {
      type: String,
      unique: [true, '409 Пользователь с таким "email" существует'],
      required: [true, '400 Поле "email" должно быть заполнено'],
      validate: {
        validator(email) {
          return validator.isEmail(email);
        },
        message: '400 Введён некорректный email',
      },
    },
    password: {
      type: String,
      required: [true, '400 Поле "password" должно быть заполнено'],
      minlength: [8, '400 Минимальная длина поля "password" - 8'],
      select: false,
    },
  },
  { versionKey: false },
);

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthorisationError('Неправильные email или пароль');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new AuthorisationError('Неправильные email или пароль');
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
