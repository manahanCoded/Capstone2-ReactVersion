import pkg from "pg";
import env from "dotenv";

env.config();


// const db = new pg.Pool({
//     user: process.env.DB_USER,
//     host: process.env.DB_HOST,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_DATABASE,
//     port: process.env.DB_PORT || 5432, 
//   });

  const db = new pkg.Pool({
    connectionString: process.env.DATABASE_URL, // Uses a single connection string
    ssl:  {rejectUnauthorized: false }
  });
  
  

db.connect()

export default db;
