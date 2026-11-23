import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Clean connection string if channel_binding is present (node-postgres does not support channel_binding query param)
let connectionString = process.env.DATABASE_URL || '';
connectionString = connectionString.replace(/&?channel_binding=[^&]*/g, '');

export const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

// Helper for single query
export const query = (text, params) => pool.query(text, params);
