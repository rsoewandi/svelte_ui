const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); 

const User = sequelize.define('User', {
  // Kolom untuk Username
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,  // Username harus unik
  },
  // Kolom untuk Password
  password: {
    type: DataTypes.STRING,
    allowNull: false,  // Password tidak boleh kosong
  },
});

// Export model User
module.exports = User;
