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
  res.json({ info: 'Atelier E-Commerce API' });
});

app.get('/products', async (req, res) => {
  try {
    const page = req.query.page || 1;
    const count = req.query.count || 5;

    const cacheKey = `page_count_${page}_${count}`;
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      console.log('Returning cached data for getProducts')
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
app.get('/products/:product_id', async (req, res) => {
  try {
    const { product_id } = req.params;

    const cacheKey = `product_id_${product_id}`;
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      console.log('Returning cached data for getProductID')
      return res.send(JSON.parse(cachedData));
    }

    const response = await helper.getProductInfo(product_id);
    await redisClient.set(cacheKey, JSON.stringify(response), {
      EX: 300,
      NX: true,
    });

    res.status(200).send(response);
  } catch (err) {
    console.error(`Error while getting product info: ${err.message}`);
    res.status(err.statusCode || 500).json({ message: err.message });
  }
});
app.get('/products/:product_id/styles', async (req, res) => {
  try {
    const { product_id } = req.params;
    console.log('product id is...', product_id)
    const cacheKey = `product_style_${product_id}`;
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      console.log('Returning cached data for getStyles')
      return res.send(JSON.parse(cachedData));
    }

    const response = await helper.getProductStyles(product_id);
    await redisClient.set(cacheKey, JSON.stringify(response), {
      EX: 300,
      NX: true,
    });

    res.status(200).send(response);
  } catch (err) {
    console.error(`Error while getting product style info: ${err.message}`);
    res.status(err.statusCode || 500).json({ message: err.message });
  }
});

app.get('/products/:product_id/related', async (req, res) => {
  try {
    const { product_id } = req.params;
    console.log('product id is...', product_id)
    const cacheKey = `product_related_${product_id}`;
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      console.log('Returning cached data for getStyles')
      return res.send(JSON.parse(cachedData));
    }

    const response = await helper.getProductRelated(product_id);
    console.log('response is...', response)
    await redisClient.set(cacheKey, JSON.stringify(response), {
      EX: 300,
      NX: true,
    });

    res.status(200).send(response);
  } catch (err) {
    console.error(`Error while getting product style info: ${err.message}`);
    res.status(err.statusCode || 500).json({ message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
