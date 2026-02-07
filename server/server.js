const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

// 🔥 Supabase PostgreSQL connection
const pool = new Pool({
  connectionString:
    "postgresql://postgres:r5RJ7DjR0fGafOpU@db.auzssmkzgjiewktspwxw.supabase.co:5432/postgres",
  ssl: { rejectUnauthorized: false },
});

// Create table automatically when server starts
async function createTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS tasks(
      id SERIAL PRIMARY KEY,
      text TEXT NOT NULL,
      date TEXT
    );
  `);
  console.log("Database ready ✅");
}

createTable();

// Root test route
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// 📥 Get all tasks
app.get("/tasks", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tasks ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ➕ Add new task
app.post("/tasks", async (req, res) => {
  try {
    const { text, date } = req.body;
    await pool.query(
      "INSERT INTO tasks(text, date) VALUES($1, $2)",
      [text, date]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ❌ Delete task
app.delete("/tasks/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM tasks WHERE id=$1", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on port " + PORT));
