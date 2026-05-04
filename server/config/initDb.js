import { pool } from "./connectDb.js";

const initDb = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        credits INTEGER DEFAULT 100,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS interviews (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        role VARCHAR(255) NOT NULL,
        experience VARCHAR(255) NOT NULL,
        mode VARCHAR(50) NOT NULL CHECK (mode IN ('HR', 'Technical')),
        resume_text TEXT,
        final_score NUMERIC(5,2) DEFAULT 0,
        status VARCHAR(50) DEFAULT 'Incompleted' CHECK (status IN ('Incompleted', 'completed')),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS questions (
        id SERIAL PRIMARY KEY,
        interview_id INTEGER NOT NULL REFERENCES interviews(id) ON DELETE CASCADE,
        question_index INTEGER NOT NULL,
        question TEXT,
        difficulty VARCHAR(50),
        time_limit INTEGER,
        answer TEXT,
        feedback TEXT,
        score NUMERIC(5,2) DEFAULT 0,
        confidence NUMERIC(5,2) DEFAULT 0,
        communication NUMERIC(5,2) DEFAULT 0,
        correctness NUMERIC(5,2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        plan_id VARCHAR(255),
        amount NUMERIC(10,2),
        credits INTEGER,
        razorpay_order_id VARCHAR(255),
        razorpay_payment_id VARCHAR(255),
        status VARCHAR(50) DEFAULT 'created' CHECK (status IN ('created', 'paid', 'failed')),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log("All PostgreSQL tables initialized successfully");
  } catch (error) {
    console.error(`Failed to initialize tables: ${error}`);
  }
};

export default initDb;
