const Card = require('../models/card');
const NotFoundError = require('../error/not-found-error');
const NoStatusError = require('../error/no-status-error');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
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
    .catch(next);
};

module.exports.deleteCardById = (req, res, next) => {
  const { cardId } = req.params;
  Card
    .findByIdAndRemove(cardId)
    .orFail()
    .then((card) => {
      res.status(200)
        .send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new NotFoundError('карточка с таким id - отсутствует');
      } else {
        throw new NoStatusError('Что-то пошло не так');
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
        throw new NoStatusError('Что-то пошло не так');
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
      throw new NotFoundError('карточка с таким id - отсутствует');
    }
    return res.status(200)
      .send(card);
  })
    // .catch((err) => {
    //   if (err.name === 'CastError') {
    //     res.status(400)
    //       .send({ message: 'карточка с таким id - отсутствует' });
    //   } else {
    //     throw new NoStatusError('Что-то пошло не так');
    //   }
    // })
    .catch(next);
};
