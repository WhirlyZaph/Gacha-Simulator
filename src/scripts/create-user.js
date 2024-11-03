const bcrypt = require('bcryptjs');
const pool = require('../src/config/db.config');

async function createTestUser() {
    try {
        const nrp = '123456';
        const password = 'test123';
        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query(
            'INSERT INTO users (nrp, password_hash) VALUES ($1, $2)',
            [nrp, hashedPassword]
        );

        console.log('Test user created successfully');
        process.exit(0);
    } catch (err) {
        console.error('Error creating test user:', err);
        process.exit(1);
    }
}

createTestUser();