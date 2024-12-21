import pg from "pg"
import env from "dotenv"

env.config()

const db = new pg.Client({
    user: process.env.DB_user,
    host: process.env.DB_host,
    password: process.env.DB_password,
    database: process.env.DB_database,
    port: process.env.DB_port
})

db.connect()

export default db