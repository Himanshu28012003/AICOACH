import { pool } from "../config/connectDb.js";

const Payment = {
  async create({ userId, planId, amount, credits, razorpayOrderId, status = "created" }) {
    const result = await pool.query(
      `INSERT INTO payments (user_id, plan_id, amount, credits, razorpay_order_id, status)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [userId, planId, amount, credits, razorpayOrderId, status]
    );
    return result.rows[0];
  },

  async findOne(whereClause) {
    const keys = Object.keys(whereClause);
    const values = Object.values(whereClause);
    const conditions = keys.map((k, i) => `${k} = $${i + 1}`).join(" AND ");
    const result = await pool.query(
      `SELECT * FROM payments WHERE ${conditions} LIMIT 1`,
      values
    );
    return result.rows[0] || null;
  },

  async save(payment) {
    const result = await pool.query(
      `UPDATE payments SET status = $1, razorpay_payment_id = $2, updated_at = NOW()
       WHERE id = $3 RETURNING *`,
      [payment.status, payment.razorpay_payment_id, payment.id]
    );
    return result.rows[0] || null;
  },
};

export default Payment;