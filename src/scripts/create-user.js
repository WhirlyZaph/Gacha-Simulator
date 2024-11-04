const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '../.env' });
const pool = require('../config/config');
async function createTestUser() {
    try {
        const nrp = '123456';
        const password = 'test123'; // Your desired password
        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query(
            'INSERT INTO users (nrp, password_hash, created_at) VALUES ($1, $2, CURRENT_TIMESTAMP)',
            [nrp, hashedPassword]
        );

        console.log('Test user created successfully');
    } catch (err) {
        console.error('Error creating test user:', err);
    }
}

createTestUser();