const express = require('express');
const controllers = require('./controllers.js')
const app = express();

app.use(express.json())

app.get('/products', controllers.get)

const PORT = process.env.APP_PORT || 3000;

app.listen(PORT);
console.log(`Server listening at http://localhost:${PORT}`);