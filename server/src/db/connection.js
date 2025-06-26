import dotenv from "dotenv";
import { Pool } from "pg";
dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const connectDB = async () => {
  try {
    await pool.connect();
    console.log("PostgreSQL connected");
  } catch (err) {
    console.error("DB connection error:", err.message);
    process.exit(1); 
  }
};

export { pool, connectDB };
