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

router.get("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM teachers WHERE id = $1", [
      id,
    ]);
    const teacher = result.rows[0];
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    return res.status(200).json(teacher);
  } catch (error) {
    console.error("Error in fetching teacher:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
