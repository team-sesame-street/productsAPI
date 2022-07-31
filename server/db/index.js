const path = require('path');

require("dotenv").config({ path: path.resolve(__dirname, '../../.env') });


const { Pool } = require("pg");

console.log(process.env.DB_ADMIN_USERNAME)
const pool = new Pool({
  user: process.env.DB_ADMIN_USERNAME,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  host: process.env.DB_HOST
});

module.exports = pool;