import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userValidation } from "../../validations/userValidation.js";
import { pool } from "../../db/connection.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const parsed = userValidation.safeParse(req.body);

  if (!parsed.success) {
    const formattedErrors = parsed.error.issues.map((err) => ({
      field: err.path[0],
      message: err.message,
    }));

    return res.status(400).json({
      message: "Validation error",
      errors: formattedErrors,
    });
  }
  const { name, email, password, userType } = parsed.data;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const result = await pool.query(
      `INSERT INTO users (name, email, password, userType) VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, email, hashedPassword, userType]
    );
    return res.status(201).json({
      message: "User registered successfully",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Error in user registration:", error);

    if (error.code === "23505") {
      return res.status(400).json({ message: "Email already exists" });
    }

    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { type, email, password, refreshToken } = req.body;
    if (type === "email") {
      const result = await pool.query("SELECT * FROM users WHERE email = $1", [
        email,
      ]);
      const user = result.rows[0];
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      await handleEmailLogin({ user, password, res });
    } else if (type === "refresh") {
      if (!refreshToken) {
        return res.status(401).json({ message: "Refresh token not found" });
      } else {
        await handleRefreshToken({ refreshToken, res });
      }
    } else {
      return res.status(400).json({ message: "Invalid login type" });
    }
  } catch (error) {
    console.error("Error in user login:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

export default router;

async function handleEmailLogin({ password, user, res }) {
  const isValidPassword = await bycrypt.compare(password, user.password);
  if (isValidPassword) {
    const userObj = generateUserObject(user);
    return res.json(userObj);
  } else {
    return res.status(401).json({ message: "Invalid email or password" });
  }
}

function generateUserObject(user) {
  const { accessToken, refreshToken } = generateToken(user);
  const { password, ...userObj } = user;
  userObj.accessToken = accessToken;
  userObj.refreshToken = refreshToken;
  return userObj;
}

function generateToken(user) {
  const payload = {
    email: user.email,
    id: user.id,
    userType: user.userType,
  };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
  return { accessToken, refreshToken };
}

async function handleRefreshToken({ refreshToken, res }) {
  jwt.verify(refreshToken, process.env.JWT_SECRET, async (err, payload) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      const result = await pool.query("SELECT * FROM users WHERE email = $1", [
        payload.id,
      ]);
      const user = result.rows[0];
      if (user) {
        const userObj = generateUserObject(user);
        return res.status(200).json(userObj);
      } else {
        return res.status(401).json({ message: "User not found" });
      }
    } catch (error) {
      console.error("Error in handling refresh token:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
}
