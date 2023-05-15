const router = require('express').Router();

const {
  getCards, createCard, deleteCardById, likeCard, dislikeCard,
} = require('../controllers/card');

router.get('/', getCards); // ok

router.post('/', createCard); // ok

router.delete('/:cardId', deleteCardById); // ok

router.put('/:cardId/likes', likeCard);

router.delete('/:cardId/likes', dislikeCard);

module.exports = router;
