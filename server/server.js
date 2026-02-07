import express from "express";
import cors from "cors";
import sqlite3 from "sqlite3";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

/* ---------------- DATABASE ---------------- */

const db = new sqlite3.Database("./database.sqlite", (err) => {
  if (err) console.error(err.message);
  console.log("Connected to the SQLite database.");
});

/* ---------------- OPENAI ---------------- */

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "demo-key",
});

/* ---------------- AUTH (TEMP MOCK) ---------------- */

const requireAuth = (req, res, next) => {
  req.userId = req.headers.authorization || "default-user-id";
  next();
};

/* ---------------- ROUTES ---------------- */

/* Health check */
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

/* Get tasks */
app.get("/tasks", requireAuth, (req, res) => {
  db.all(
    "SELECT * FROM tasks WHERE user_id = ?",
    [req.userId],
    (err, rows) => {
      if (err) return res.status(500).json(err);
      res.json(rows);
    }
  );
});

/* Create task */
app.post("/tasks", requireAuth, (req, res) => {
  const { title, completed } = req.body;

  const id = uuidv4();

  db.run(
    "INSERT INTO tasks (id, title, completed, user_id) VALUES (?, ?, ?, ?)",
    [id, title, completed ? 1 : 0, req.userId],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ id, title, completed });
    }
  );
});

/* Toggle task */
app.put("/tasks/:id", requireAuth, (req, res) => {
  const { completed } = req.body;

  db.run(
    "UPDATE tasks SET completed = ? WHERE id = ?",
    [completed ? 1 : 0, req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ success: true });
    }
  );
});

/* Delete task */
app.delete("/tasks/:id", requireAuth, (req, res) => {
  db.run("DELETE FROM tasks WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ success: true });
  });
});

/* AI Task Generator */
app.post("/ai/generate", requireAuth, async (req, res) => {
  try {
    const { goal } = req.body;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a productivity assistant.",
        },
        {
          role: "user",
          content: `Break this goal into daily tasks: ${goal}`,
        },
      ],
    });

    const tasks = completion.choices[0].message.content;
    res.json({ tasks });
  } catch (err) {
    console.error(err);
    res.json({
      tasks:
        "1. Plan your goal\n2. Break into small steps\n3. Execute daily",
    });
  }
});

/* ---------------- START SERVER ---------------- */

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT} 🚀`);
});
