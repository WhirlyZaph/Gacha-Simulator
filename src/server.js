require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('./config/config.js');

const app = express();

// CORS configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));

app.use(express.json());

// Verify database connection
const verifyDatabaseConnection = async () => {
    try {
        const client = await pool.connect();
        console.log('Database connection successful');
        client.release();
    } catch (err) {
        console.error('Database connection error:', err.message);
        process.exit(1); // Exit the process if unable to connect to the database
    }
};

// Call this function when the server starts
verifyDatabaseConnection();

// Test route
app.get('/', (req, res) => {
    res.send('Server is running');
});

// Database test route
app.get('/api/test-db', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({ message: 'Database connection successful', time: result.rows[0].now });
    } catch (err) {
        console.error('Database test error:', err.message);
        res.status(500).json({ message: 'Database test failed', error: err.message });
    }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
    try {
        const { nrp, password } = req.body;
        console.log('Login attempt for NRP:', nrp);

        const result = await pool.query('SELECT * FROM users WHERE nrp = $1', [nrp]);
        console.log('Query result:', result.rows);

        if (result.rows.length === 0) {
            console.log('User not found');
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = result.rows[0];
        console.log('User found:', { id: user.id, nrp: user.nrp });

        const validPassword = await bcrypt.compare(password, user.password_hash);
        console.log('Password valid:', validPassword);

        if (!validPassword) {
            console.log('Invalid password');
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        await pool.query('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1', [user.id]);
        console.log('Last login updated for user:', user.id);

        const token = jwt.sign(
            { id: user.id, nrp: user.nrp },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );
        console.log('JWT token generated');

        res.json({
            token,
            user: { id: user.id, nrp: user.nrp }
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Server error occurred', error: err.message });
    }
});

// Guest login endpoint
app.post('/api/guest-login', async (req, res) => {
    try {
        const sessionId = Math.random().toString(36).substring(2);
        console.log('Generated session ID for guest:', sessionId);

        await pool.query('INSERT INTO guest_sessions (session_id) VALUES ($1)', [sessionId]);
        console.log('Guest session inserted into database');

        const token = jwt.sign(
            { sessionId, isGuest: true },
            process.env.JWT_SECRET || 'your_jwt_secret',
            { expiresIn: '24h' }
        );
        console.log('JWT token generated for guest');

        res.json({ token, message: 'Guest login successful' });
    } catch (err) {
        console.error('Guest login error:', err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Environment:', process.env.NODE_ENV || 'development');
    console.log('Frontend URL:', process.env.FRONTEND_URL || 'http://localhost:3000');
});

console.log('Environment Variables:', process.env);