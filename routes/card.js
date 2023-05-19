const router = require('express').Router();
const { cardBodyValidator, cardIdParamsValidator } = require('../utils/requestValidators');

const {
  getCards, createCard, deleteCardById, likeCard, dislikeCard,
} = require('../controllers/card');

router.get('/', getCards);

router.post('/', cardBodyValidator, createCard);

router.delete('/:cardId', cardIdParamsValidator, deleteCardById);

router.put('/:cardId/likes', cardIdParamsValidator, likeCard);

router.delete('/:cardId/likes', cardIdParamsValidator, dislikeCard);

module.exports = router;
