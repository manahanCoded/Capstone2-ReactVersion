import pkg from "pg";
import env from "dotenv";

env.config();


// const db = new pkg.Pool({
//     user: process.env.DB_USER,
//     host: process.env.DB_HOST,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_DATABASE,
//     port: process.env.DB_PORT || 5432, 
//   });
// db.connect()

  const db = new pkg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl:  {rejectUnauthorized: false }
  });
  



export default db;
