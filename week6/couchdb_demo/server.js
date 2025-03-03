const express = require("express");
const nano = require("nano")("http://admin:admin@localhost:5984"); // Adjust credentials if needed
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const dbName = "users";

// Initialize CouchDB
async function initializeDB() {
  try {
    const dbList = await nano.db.list();
    if (!dbList.includes(dbName)) {
      await nano.db.create(dbName);
      console.log(`Database '${dbName}' created.`);
    }
  } catch (error) {
    console.error("Error initializing CouchDB:", error);
  }
}
initializeDB();

const db = nano.use(dbName);

// Get all users
app.get("/users", async (req, res) => {
  try {
    const users = await db.list({ include_docs: true });
    res.json(users.rows.map((row) => row.doc));
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Add a new user
app.post("/users", async (req, res) => {
  const { name, email } = req.body;
  try {
    const response = await db.insert({ name, email });
    res.json({ id: response.id, name, email });
  } catch (error) {
    res.status(500).json({ error: "Failed to add user" });
  }
});

// Update user
app.put("/users/:id", async (req, res) => {
  const { name, email } = req.body;
  const { id } = req.params;
  try {
    const existingUser = await db.get(id);
    const response = await db.insert({
      _id: id,
      _rev: existingUser._rev,
      name,
      email,
    });
    res.json({ message: "User updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update user" });
  }
});

// Delete user
app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const existingUser = await db.get(id);
    await db.destroy(id, existingUser._rev);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user" });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
