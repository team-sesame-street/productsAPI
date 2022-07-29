const pool = require('./db');

const getProducts = async (page = 1, count = 5) => {
  let res = await pool.query(`SELECT * from PRODUCTS limit $1`, [page * count]);
  return res;
}

module.exports = { getProducts }