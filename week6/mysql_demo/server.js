const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "rootpassword",
  database: process.env.DB_NAME || "user_db",
  port: 3306,
});

db.connect((err) => {
  if (err) {
    console.log("Database connection failed.", err);
    process.exit(1);
  } else {
    console.log("Connected to MySQL.");
    createTable(db);
  }
});

const createTable = (db) => {
  db.query(
    `CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255),
      email VARCHAR(255)
    )`,
    (err, result) => {
      if (err) console.error("Error creating table:", err);
      else console.log("Table checked/created successfully.");
    }
  );
};

// Get all users
app.get("/users", (req, res) => {
  console.log(db);
  db.query("SELECT * FROM users", (err, results) => {
    if (err) {
      console.log(err, results);
      res.status(500).json({ error: err });
      return;
    }
    res.json(results);
  });
});

// Add a new user
app.post("/users", (req, res) => {
  const { name, email } = req.body;
  db.query(
    "INSERT INTO users (name, email) VALUES (?, ?)",
    [name, email],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err });
        return;
      }
      res.json({ id: result.insertId, name, email });
    }
  );
});

// Update user
app.put("/users/:id", (req, res) => {
  const { name, email } = req.body;
  const { id } = req.params;
  db.query(
    "UPDATE users SET name=?, email=? WHERE id=?",
    [name, email, id],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: "Failed to update user" });
        return;
      }
      res.json({ message: "User updated successfully" });
    }
  );
});

// Delete user
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM users WHERE id=?", [id], (err, result) => {
    if (err) {
      res.status(500).json({ error: "Failed to delete user" });
      return;
    }
    res.json({ message: "User deleted successfully" });
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
