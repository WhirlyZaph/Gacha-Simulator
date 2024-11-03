const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('./config/db.config');

const app = express();

app.use(cors());
app.use(express.json());

// Login endpoint
app.post('/api/login', async (req, res) => {
    try {
        const { nrp, password } = req.body;

        // Check if user exists
        const user = await pool.query(
            'SELECT * FROM users WHERE nrp = $1',
            [nrp]
        );

        if (user.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check password
        const validPassword = await bcrypt.compare(password, user.rows[0].password_hash);
        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Update last login
        await pool.query(
            'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
            [user.rows[0].id]
        );

        // Generate JWT token
        const token = jwt.sign(
            { id: user.rows[0].id, nrp: user.rows[0].nrp },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Guest login endpoint
app.post('/api/guest-login', async (req, res) => {
    try {
        const sessionId = Math.random().toString(36).substring(2);

        await pool.query(
            'INSERT INTO guest_sessions (session_id) VALUES ($1)',
            [sessionId]
        );

        const token = jwt.sign(
            { sessionId, isGuest: true },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});