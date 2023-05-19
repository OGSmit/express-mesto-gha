const router = require('express').Router();
const { createUser, login } = require('../controllers/user');
const { signUpBodyValidator, signInBodyValidator } = require('../utils/requestValidators');
const auth = require('../middlewares/auth');
const routesUser = require('./user');
const routesCard = require('./card');
const NotFoundError = require('../error/not-found-error');

router.post('/signup', signUpBodyValidator, createUser);

router.post('/signin', signInBodyValidator, login);

router.use('/users', auth, routesUser);
router.use('/cards', auth, routesCard);

router.use('/*', () => {
  throw new NotFoundError('Страница не найдена');
});

module.exports = router;
