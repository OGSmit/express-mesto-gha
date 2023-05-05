const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => res.status(500)
      .send({ message: err.message }));
};

module.exports.createCard = (req, res) => {
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
        res.status(400)
          .send({ message: 'Invalid data to create card' });
      } else {
        res.status(500)
          .send({ message: err.message });
      }
    });
};

module.exports.deleteCardById = (req, res) => {
  const { cardId } = req.params;
  Card
    .findByIdAndRemove(cardId)
    // .orFail()
    .then((card) => {
      if (!card) {
        return res.status(404)
          .send({ message: 'Not found: Invalid _id' });
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
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  ).then((card) => {
    if (!card) {
      return res.status(404)
        .send({ message: 'Not found: Invalid _id' });
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
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  ).then((card) => {
    if (!card) {
      return res.status(404)
        .send({ message: 'Not found: Invalid _id' });
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
    });
};
