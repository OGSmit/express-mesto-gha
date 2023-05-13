const router = require('express').Router();

const {
  getUsers, getUserById, updateUser, updateUserAvatar, getCurrentUser,
} = require('../controllers/user');

router.get('/', getUsers);

// router.post('/', createUser);

router.get('/:userId', getUserById);

router.patch('/me', updateUser);

router.patch('/me/avatar', updateUserAvatar);

router.get('/me', getCurrentUser);

module.exports = router;
