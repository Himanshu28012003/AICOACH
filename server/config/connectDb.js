import dotenv from "dotenv";
dotenv.config();

import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const connectDb = async () => {
  try {
    const client = await pool.connect();
    console.log("PostgreSQL Database Connected");
    client.release();
  } catch (error) {
    console.log(`DataBase Error ${error}`);
  }
};

export { pool };
export default connectDb;