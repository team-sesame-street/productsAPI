const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_ADMIN_USERNAME,
  password: process.env.DB_ADMIN_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  host: process.env.DB_HOST,
});

module.exports = pool;
