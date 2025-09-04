import pg from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();
const { Pool } = pg;

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,

    max: 20, // maximum number of connections in the pool
    idleTimeoutMillis: 30000, // 30 seconds of inactivity before closing a connection
    connectionTimeoutMillis: 2000, // 2 seconds to connect to the database
});

pool.on('connect', () => {
    console.log('Connected to the database');
});

pool.on('error', (err) => {
    console.error('Error with the database', err);
    process.exit(-1);
});

export default pool;