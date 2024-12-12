const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Sequelize, DataTypes } = require('sequelize');

// Set up SQLite database using Sequelize
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite'  // File database SQLite
});

// Define User model
const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

// Initialize Express app
const app = express();
const PORT = 3000;

const SECRET_KEY = 'your-secret-key'; // Ganti dengan secret key yang aman

app.use(bodyParser.json());

// Endpoint Register
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        // Cek apakah username sudah ada
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(409).json({ error: 'Username already exists' }); // Conflict error jika user sudah ada
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ username, password: hashedPassword });
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Endpoint Login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ where: { username } });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Sinkronisasi dengan database dan menjalankan server
app.listen(PORT, async () => {
    console.log(`Server running on http://localhost:${PORT}`);
    try {
        // Sinkronisasi database (ini bisa menggunakan { force: true } jika ingin reset database setiap kali)
        await sequelize.sync({ force: true });
        console.log('Database initialized');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
});


// const express = require('express');
// const bodyParser = require('body-parser');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const User = require('./models/User'); // Import model User

// const app = express();
// const PORT = 3000;

// const SECRET_KEY = 'your-secret-key'; // Ganti dengan secret key yang aman

// app.use(bodyParser.json());

// // Endpoint Register
// app.post('/register', async (req, res) => {
//     const { username, password } = req.body;
//     try {
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const newUser = await User.create({ username, password: hashedPassword });
//         res.status(201).json({ message: 'User registered successfully', user: newUser });
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// });

// // Endpoint Login
// app.post('/login', async (req, res) => {
//     const { username, password } = req.body;
//     try {
//         const user = await User.findOne({ where: { username } });
//         if (!user) return res.status(404).json({ error: 'User not found' });

//         const isValidPassword = await bcrypt.compare(password, user.password);
//         if (!isValidPassword) return res.status(401).json({ error: 'Invalid credentials' });

//         const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '1h' });
//         res.json({ message: 'Login successful', token });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// // Jalankan server
// app.listen(PORT, async () => {
//     console.log(`Server running on http://localhost:${PORT}`);
//     await sequelize.sync({ force: true }); // Sinkronisasi database
//     console.log('Database initialized');
// });
