/* eslint-disable max-len */
const redis = require('redis');

// const client = redis.createClient({
//   socket: {
//     host: process.env.REDIS_HOST,
//     port: process.env.REDIS_PORT,
//   },
//   password: process.env.REDIS_PASSWORD,
// });

const client = redis.createClient({
  url: 'redis://:XU0Zc6wb3pt3OyDLxgCVtDxygAC8JXpC@redis-19969.c60.us-west-1-2.ec2.cloud.redislabs.com:19969',
});

client.connect();

client.on('connect', () => {
  console.log('client connected');
});

const { promisify } = require('util');

const setAsyncEx = promisify(client.SETEX).bind(client);
const getAsync = promisify(client.get).bind(client);

client.on('error', (err) => {
  console.log(`Error: ${err}`);
});

const saveWithTtl = async (key, value, ttlSeconds = 60) => {
  // await client.connect();
  return await setAsyncEx(key, ttlSeconds, JSON.stringify(value));
};

// eslint-disable-next-line consistent-return
const get = async (key) => {
  // await client.connect();
  console.log('inside get, key is ', key)
  const jsonString = await getAsync(key);
  console.log('jsonString is...', jsonString)

  if (jsonString) {
    console.log('jsonstring hit')
    return JSON.parse(jsonString);
  } else {
    console.log('missed')
  }
};

module.exports = {
  saveWithTtl,
  get,
};
