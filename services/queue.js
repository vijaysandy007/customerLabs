const { Queue } = require('bullmq');
const connection = require('./redis');
const webhookQueue = new Queue('webhookQueue', { connection });

module.exports = { webhookQueue };
