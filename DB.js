const { Sequelize } = require('sequelize');

if (process.env.NODE_ENV === 'production') {
  module.exports = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,

    {
      dialect: 'mysql',
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      logging: false,
      sync: true
    }
  );
} else {
  module.exports = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,

    {
      dialect: 'mysql',
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      logging: false
    }
  );
}