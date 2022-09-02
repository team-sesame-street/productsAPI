/* eslint-disable import/extensions */
const express = require('express');
const cors = require('cors');

const { redisClient } = require('./cache.js');
const helper = require('./helpers.js');

const app = express();
const PORT = process.env.APP_PORT || 3000;

app.use(express.static('../public'));
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.json({ info: 'Node.js, Express, and Postgres API' });
});

app.get('/products', async (req, res) => {
  try {
    const page = req.query.page || 1;
    const count = req.query.count || 5;

    const cacheKey = `page_count_${page}_${count}`;
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      console.log('Returning cached data')
      return res.send(JSON.parse(cachedData));
    }
    const response = await helper.getProducts(page, count);
    await redisClient.set(cacheKey, JSON.stringify(response), {
      EX: 300,
      NX: true,
    });

    res.status(200).send(response);
  } catch (err) {
    console.error(`Error while getting products: ${err.message}`);
    res.status(err.statusCode || 500).json({ message: err.message });
  }
});
// app.get('/products/:product_id', helpers.productInfo);
// app.get('/products/:product_id/styles', helpers.productStyles);
// app.get('/products/:product_id/related', helpers.productRelated);


app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
