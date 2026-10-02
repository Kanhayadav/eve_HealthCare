import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

pool
  .query("SELECT NOW()")
  .then(() => {
    console.log("PostgreSQL connected");
  })
  .catch((err: any) => {
    console.error("PostgreSQL connection failed:", err);
  });

export default pool;
