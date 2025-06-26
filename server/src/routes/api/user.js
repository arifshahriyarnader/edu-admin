import express from "express";
import bycrypt from "bcrypt";
import { pool } from "../../db/connection.js";

const router = express.Router();

// Register a new user
router.post("/register", async (req, res) => {
  try {
    const salt = await bycrypt.genSalt(10);
    const hashedPassword = await bycrypt.hash(req.body.password, salt);
    const userObj = {
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      userType: req.body.userType || user,
    };
    const result = await pool.query(
      `INSERT INTO users (name, email, password, userType) 
     VALUES ($1, $2, $3, $4) RETURNING *`,
      [userObj.name, userObj.email, userObj.password, userObj.userType]
    );
    return res.status(201).json({
      message: "User registered successfully",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Error in user registration:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;