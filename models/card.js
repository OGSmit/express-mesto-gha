const mongoose = require('mongoose');
const validator = require('validator');

const cardsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, '400 Поле "name" должно быть заполнено'],
      minlength: [2, '400 Минимальная длина поля "name" - 2'],
      maxlength: [30, '400 Максимальная длина поля "name" - 30'],
    },
    link: {
      type: String,
      required: [true, '400 Поле "link" должно быть заполнено'],
      validate: {
        validator(link) {
          console.log(validator.isURL(link));
          return validator.isURL(link);
        },
        message: '400 некорректный адрес',
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      // required: true,
    },
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      default: [],
    }],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model('card', cardsSchema);
