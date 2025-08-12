const LogController = require('../controllers/log');
const express = require('express');
const router = express.Router();
const AdminAuth = require('../middleware/admin');

router.get('/', AdminAuth, LogController.getLogs);
router.get('/:id', AdminAuth, LogController.getLogById);

module.exports = router