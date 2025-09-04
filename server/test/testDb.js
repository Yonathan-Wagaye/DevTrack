import pool from '../config/database.js';

const testDb = async () => {
    try {
        const res = await pool.query('SELECT NOW()');
        console.log(res.rows);
    } catch (error) {
        console.error('Error with the database', error);
    }
};

testDb();