const UserController = require('../controllers/user')
const auth = require('../middleware/user')
const router = require('express').Router()

router.post('/auth/register', UserController.register)
router.post('/auth/login', UserController.login)
router.get('/user/getUser', auth, UserController.getUser)

module.exports = router