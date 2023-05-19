const router = require('express').Router();
const { userIdParamsValidator, userMeBodyValidator, avatarBodyValidator } = require('../utils/requestValidators');

const {
  getUsers, getUserById, updateUser, updateUserAvatar, getMe,
} = require('../controllers/user');

router.get('/', getUsers);

router.get('/me', getMe);

router.get('/:userId', userIdParamsValidator, getUserById);

router.patch('/me', userMeBodyValidator, updateUser);

router.patch('/me/avatar', avatarBodyValidator, updateUserAvatar);

module.exports = router;
