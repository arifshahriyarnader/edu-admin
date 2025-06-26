import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { pool } from "./connection.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const excuteSqlFile = async (filename) => {
  const filePath = path.join(__dirname, "../db/sql", filename);
  const sql = fs.readFileSync(filePath).toString();
  try {
    await pool.query(sql);
    console.log(`Executed SQL file: ${filename}`);
  } catch (error) {
    console.error(`Error executing SQL file ${filename}:`, error);
  }
};

const createTables = async () => {
  await excuteSqlFile("users.sql");
};
export default createTables;
