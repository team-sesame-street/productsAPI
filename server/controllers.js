const model = require('./models.js');

const get = (req, res) => {
  res.send(model.getProducts())
}

module.exports = {
  get
}