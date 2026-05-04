import { pool } from "../config/connectDb.js";

const User = {
  async findOne(whereClause) {
    const keys = Object.keys(whereClause);
    const values = Object.values(whereClause);
    const conditions = keys.map((k, i) => `${k} = $${i + 1}`).join(" AND ");
    const result = await pool.query(
      `SELECT * FROM users WHERE ${conditions} LIMIT 1`,
      values
    );
    return result.rows[0] || null;
  },

  async findById(id) {
    const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
    return result.rows[0] || null;
  },

  async findByIdExclude(id, excludeFields = []) {
    const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
    if (!result.rows[0]) return null;
    const user = { ...result.rows[0] };
    excludeFields.forEach((f) => delete user[f]);
    return user;
  },

  async create({ name, email, password, credits = 100 }) {
    const result = await pool.query(
      `INSERT INTO users (name, email, password, credits) VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, email, password, credits]
    );
    return result.rows[0];
  },

  async updateCredits(id, creditsDelta) {
    const result = await pool.query(
      `UPDATE users SET credits = credits + $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [creditsDelta, id]
    );
    return result.rows[0] || null;
  },

  async save(user) {
    const result = await pool.query(
      `UPDATE users SET name = $1, email = $2, credits = $3, updated_at = NOW() WHERE id = $4 RETURNING *`,
      [user.name, user.email, user.credits, user.id]
    );
    return result.rows[0] || null;
  },
};

export default User;