const { Sequelize } = require('sequelize');

// Membuat koneksi ke SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite', // Path ke file SQLite (misalnya: database.sqlite)
});

module.exports = sequelize;
