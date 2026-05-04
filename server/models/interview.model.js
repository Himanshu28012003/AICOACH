import { pool } from "../config/connectDb.js";

const Interview = {
  async create({ userId, role, experience, mode, resumeText, questions }) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const interviewResult = await client.query(
        `INSERT INTO interviews (user_id, role, experience, mode, resume_text)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [userId, role, experience, mode, resumeText]
      );
      const interview = interviewResult.rows[0];

      const insertedQuestions = [];
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        const qResult = await client.query(
          `INSERT INTO questions (interview_id, question_index, question, difficulty, time_limit)
           VALUES ($1, $2, $3, $4, $5) RETURNING *`,
          [interview.id, i, q.question, q.difficulty, q.timeLimit]
        );
        insertedQuestions.push(qResult.rows[0]);
      }

      await client.query("COMMIT");

      return {
        ...interview,
        questions: insertedQuestions.map((q) => ({
          id: q.id,
          question: q.question,
          difficulty: q.difficulty,
          timeLimit: q.time_limit,
          answer: q.answer,
          feedback: q.feedback,
          score: Number(q.score) || 0,
          confidence: Number(q.confidence) || 0,
          communication: Number(q.communication) || 0,
          correctness: Number(q.correctness) || 0,
        })),
      };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },

  async findById(id) {
    const interviewResult = await pool.query(
      `SELECT * FROM interviews WHERE id = $1`,
      [id]
    );
    if (!interviewResult.rows[0]) return null;

    const interview = interviewResult.rows[0];
    const questionsResult = await pool.query(
      `SELECT * FROM questions WHERE interview_id = $1 ORDER BY question_index`,
      [id]
    );

    interview.questions = questionsResult.rows.map((q) => ({
      id: q.id,
      question: q.question,
      difficulty: q.difficulty,
      timeLimit: q.time_limit,
      answer: q.answer,
      feedback: q.feedback,
      score: Number(q.score) || 0,
      confidence: Number(q.confidence) || 0,
      communication: Number(q.communication) || 0,
      correctness: Number(q.correctness) || 0,
    }));

    return interview;
  },

  async findByUserId(userId) {
    const result = await pool.query(
      `SELECT id, role, experience, mode, final_score AS "finalScore", status, created_at AS "createdAt"
       FROM interviews
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    );
    return result.rows;
  },

  async updateQuestion(questionId, updates) {
    const setClauses = [];
    const values = [];
    let idx = 1;

    for (const [key, value] of Object.entries(updates)) {
      setClauses.push(`${key} = $${idx}`);
      values.push(value);
      idx++;
    }
    values.push(questionId);

    const result = await pool.query(
      `UPDATE questions SET ${setClauses.join(", ")} WHERE id = $${idx} RETURNING *`,
      values
    );
    return result.rows[0] || null;
  },

  async updateInterview(id, updates) {
    const setClauses = [];
    const values = [];
    let idx = 1;

    for (const [key, value] of Object.entries(updates)) {
      setClauses.push(`${key} = $${idx}`);
      values.push(value);
      idx++;
    }
    setClauses.push(`updated_at = NOW()`);
    values.push(id);

    const result = await pool.query(
      `UPDATE interviews SET ${setClauses.join(", ")} WHERE id = $${idx} RETURNING *`,
      values
    );
    return result.rows[0] || null;
  },
};

export default Interview;