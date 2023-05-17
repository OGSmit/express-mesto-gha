const router = require('express').Router();

const {
  getUsers, getUserById, updateUser, updateUserAvatar, getMe,
} = require('../controllers/user');

router.get('/', getUsers);

router.get('/me', getMe);

router.get('/:userId', getUserById);

router.patch('/me', updateUser);

router.patch('/me/avatar', updateUserAvatar);

module.exports = router;
