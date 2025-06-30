import express from "express";
import { pool } from "../../db/connection.js";
import { authenticateToken } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create-teacher", authenticateToken, async (req, res) => {
  const { name, email, department, salary, mobile } = req.body;
  const createdBy = req.user.id;
  try {
    const result = await pool.query(
      `INSERT INTO teachers (name, email, department, salary, mobile, created_by)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [name, email, department, salary, mobile, createdBy]
    );
    res.status(201).json({
      message: "Teacher created successfully",
      teacher: result.rows[0],
    });
  } catch (error) {
    console.error("Error in creating teacher:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
