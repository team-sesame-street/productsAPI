const express = require('express');
const controllers = require('./controllers.js');

const app = express();

app.use(express.json())

app.get('/', (req, res) => {
  res.json({ info: 'Node.js, Express, and Postgres API' })
})

app.get('/products', controllers.products)
app.get('/products/:product_id', controllers.productInfo)
app.get('/products/:product_id/styles', controllers.productStyles)
app.get('/products/:product_id/related', controllers.productRelated)

const PORT = process.env.APP_PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});