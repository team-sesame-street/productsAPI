require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_ADMIN_USERNAME,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  host: process.env.DB_HOST
});

module.exports = { pool }