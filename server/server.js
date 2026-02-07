require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(cors());
app.use(express.json());

/* SUPABASE DATABASE CONNECTION */
const pool = new Pool({
  connectionString:
    "postgresql://postgres:@db.auzssmkzgjiewktspwxw.supabase.co:5432/postgres,
  ssl: {
    rejectUnauthorized: false,
  },
});

/* CREATE TABLE IF NOT EXISTS */
async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      completed BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log("Connected to Supabase PostgreSQL ✅");
}

initDB();

/* ROOT TEST ROUTE */
app.get("/", (req, res) => {
  res.send("AI Daily Planner API Running 🚀");
});

/* GET ALL TASKS */
app.get("/tasks", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM tasks ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

/* ADD TASK */
app.post("/tasks", async (req, res) => {
  try {
    const { title } = req.body;
    const id = uuidv4();

    await pool.query("INSERT INTO tasks (id, title) VALUES ($1,$2)", [
      id,
      title,
    ]);

    res.json({ id, title, completed: false });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

/* DELETE TASK */
app.delete("/tasks/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM tasks WHERE id=$1", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

/* TOGGLE COMPLETE */
app.put("/tasks/:id", async (req, res) => {
  try {
    await pool.query(
      "UPDATE tasks SET completed = NOT completed WHERE id=$1",
      [req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running 🚀"));
