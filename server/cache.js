/* eslint-disable max-len */
const redis = require('redis');

let redisClient;

(async () => {
  redisClient = redis.createClient({
    url: 'redis://:XU0Zc6wb3pt3OyDLxgCVtDxygAC8JXpC@redis-19969.c60.us-west-1-2.ec2.cloud.redislabs.com:19969' });

  redisClient.on("error", (error) => console.error(`Error : ${error}`));

  await redisClient.connect();
})();

module.exports = {
  redisClient,
};
