const router = require('express').Router();

const { getUsers, createUser, getUserById, updateUser, updateUserAvatar } = require('../controllers/user')

router.get('/users', getUsers);

router.post('/users', createUser);

router.get('/users/:userId', getUserById);

router.patch('/users/me', updateUser)

router.patch('/users/me/avatar', updateUserAvatar)

module.exports = router;