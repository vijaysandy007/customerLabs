const AccountController = require('../controllers/account')
const adminAuth = require('../middleware/admin')
const router = require('express').Router()

router.post('/', adminAuth, AccountController.createAccount)
router.get('/', adminAuth, AccountController.getAllAccounts)
router.get('/:id', adminAuth, AccountController.getAccountById)
router.put('/:id', adminAuth, AccountController.updateAccountById)
router.delete('/:id', adminAuth, AccountController.deleteAccount)

module.exports = router