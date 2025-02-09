import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const db = new pg.Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT || 5432, 
  ssl: {
    rejectUnauthorized: false, 
  },
});

db.connect()
  .then(() => console.log("Connected to NeonDB ✅"))
  .catch((err) => console.error("Database connection error ❌", err));

export default db;
