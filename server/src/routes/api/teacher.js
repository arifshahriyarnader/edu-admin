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

router.get("/all-teachers", authenticateToken, async (req, res) => {
  let page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 5;
  let offset = (page - 1) * limit;
  try {
    const result = await pool.query(
      `SELECT * FROM teachers ORDER BY id DESC LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    const countTeachers = await pool.query("SELECT COUNT(*) FROM teachers");
    const total = parseInt(countTeachers.rows[0].count);
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      page,
      limit,
      total,
      totalPages,
      teachers: result.rows,
    });
  } catch (error) {
    console.error("Error in fetching all teachers:", error);
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

router.put("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name, email, department, salary, mobile } = req.body;

  try {
    const result = await pool.query(
      `UPDATE teachers 
       SET name = $1, email = $2, department = $3, salary = $4, mobile = $5, updated_at = CURRENT_TIMESTAMP
       WHERE id = $6
       RETURNING *`,
      [name, email, department, salary, mobile, id]
    );
    const updatedTeacher = result.rows[0];
    if (!updatedTeacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    res.status(200).json({
      message: "Teacher updated successfully",
      teacher: updatedTeacher,
    });
  } catch (error) {
    console.error("Error in updating teacher:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
