require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'nitw_clubmgmt',
  process.env.DB_USER || 'nitw',
  process.env.DB_PASSWORD || 'nitw',
  {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    dialect: 'postgres',
    logging: false,
  }
);

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established');
  } catch (err) {
    console.error('Unable to connect to the database:', err.message);
  }
}

module.exports = { sequelize, testConnection };
