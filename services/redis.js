const IORedis = require('ioredis');

const redisConnection = new IORedis({
  maxRetriesPerRequest: null,
});

module.exports = redisConnection;
