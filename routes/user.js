const router = require('express').Router();

const { getUsers, createUser, getUserById, updateUser, updateUserAvatar } = require('../controllers/user')

router.get('/', getUsers);

router.post('/', createUser);

router.get('/:userId', getUserById);

router.patch('/me', updateUser)

router.patch('/me/avatar', updateUserAvatar)

module.exports = router;