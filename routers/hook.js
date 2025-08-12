const {incomingData} = require('../webhooks/hook')
const router = require('express').Router()
const { rateLimit } = require('express-rate-limit');

const rateLimiter = rateLimit({
    windowMs: 1000,
    max: 5,
    message: "Too many requests"
});

router.post('/incoming_data',rateLimiter, incomingData)
module.exports = router