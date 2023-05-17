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
  Card.findById(cardId)
    .then((card) => {
      if (!card) { throw new NotFoundError('Нет карточки с таким id'); }
      if (card.owner.toString() !== req.user._id) {
        throw new NoStatusError(403, 'Недостаточно прав для выполнения операции');
      }
      Card.findByIdAndDelete(cardId)
        .then((cardData) => {
          res.send({ data: cardData });
        })
        .catch(next);
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
      throw new NotFoundError('карточка с таким id - отсутствует');
    }
    return res.status(200)
      .send(card);
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
    .catch(next);
};
