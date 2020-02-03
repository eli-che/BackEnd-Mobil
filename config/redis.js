const redis = require('redis');

const redis_client = redis.createClient("6379", "127.0.0.1");
redis_client.on('connect', function() {
    console.log('Redis client connected');
});

redis_client.on('error', function (err) {
    console.log('Redis failed connecting ' + err);
});



module.exports = redis_client;