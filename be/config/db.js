const { Sequelize } = require('sequelize');

// Koneksi ke H2 Database
const sequelize = new Sequelize('jdbc:h2:mem:testdb', 'sa', '', {
    dialect: 'sqlite',
    dialectModule: require('sqlite3'),
});

module.exports = sequelize;
