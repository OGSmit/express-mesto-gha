const Card = require('../models/card');
const NotFoundError = require('../error/not-found-error');
const BadRequestError = require('../error/bad-request');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => res.status(500)
      .send({ message: err.message }));
};

module.exports.createCard = (req, res, next) => {
  const {
    name,
    link,
  } = req.body;
  Card
    .create({
      name,
      link,
    })
    .then((card) => res.status(201)
      .send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError({ message: 'некорректный запрос на сервер' });
      } // else {
      // res.status(500)
      // .send({ message: err.message });
      // }
    })
    .catch(next);
};

module.exports.deleteCardById = (req, res, next) => {
  const { cardId } = req.params;
  Card
    .findByIdAndRemove(cardId)
    // .orFail() если включить Автотест выкидывает ошибку
    .then((card) => {
      if (!card) {
        throw new NotFoundError({ message: 'карточка с таким id - отсутствует' });
      }
      return res.status(200)
        .send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new NotFoundError({ message: 'карточка с таким id - отсутствует' });
      } else {
        res.status(500)
          .send({ message: err.message });
      }
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  ).then((card) => {
    if (!card) {
      throw new NotFoundError({ message: 'карточка с таким id - отсутствует' });
    }
    return res.status(200)
      .send(card);
  })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new NotFoundError({ message: 'карточка с таким id - отсутствует' });
      } else {
        res.status(500)
          .send({ message: err.message });
      }
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  ).then((card) => {
    if (!card) {
      throw new NotFoundError({ message: 'карточка с таким id - отсутствует' });
    }
    return res.status(200)
      .send(card);
  })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400)
          .send({ message: 'Card with _id cannot be found' });
      } else {
        res.status(500)
          .send({ message: err.message });
      }
    })
    .catch(next);
};
