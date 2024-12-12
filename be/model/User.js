const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Import koneksi database

const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Username harus unik
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

module.exports = User;
