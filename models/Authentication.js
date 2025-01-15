const db = require("../config/dbConnection");

class Auth {
  static async create(userData) {
    try {
      const { first_name, last_name, email, password } = userData;
      const query =
        "INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)";
      const [result] = await db.execute(query, [
        first_name,
        last_name,
        email,
        password,
      ]);
      return { id: result.insertId, first_name, last_name, email };
    } catch (err) {
      console.error("Error creating user:", err);
      throw err;
    }
  }

  static async findByEmail(email) {
    try {
      const query = "SELECT * FROM users WHERE email = ?";
      const [rows] = await db.execute(query, [email]);
      if (rows.length > 0) {
        return { found: true, data: rows[0] };
      } else {
        return { found: false };
      }
    } catch (err) {
      console.error("Error fetching user by email:", err);
      throw err;
    }
  }
  static async findById(id) {
    try {
      const query = "SELECT * FROM users WHERE id = ?";
      const [rows] = await db.execute(query, [id]);
      return rows[0];
    } catch (err) {
      console.error("Error fetching user by ID:", err);
      throw err;
    }
  }

  static async update(id, userData) {
    try {
      const { first_name, last_name } = userData;
      const query =
        "UPDATE users SET first_name = ?, last_name = ? WHERE id = ?";
      await db.execute(query, [first_name, last_name, id]);
      return { id, first_name, last_name };
    } catch (err) {
      console.error("Error updating user:", err);
      throw err;
    }
  }

  static async delete(id) {
    try {
      const query = "DELETE FROM users WHERE id = ?";
      await db.execute(query, [id]);
    } catch (err) {
      console.error("Error deleting user:", err);
      throw err;
    }
  }

  static async set(data) {
    try {
      const { email, password } = data;
      const query = "UPDATE users SET password = ? WHERE email = ?";
      await db.execute(query, [password, email]);
      return { id };
    } catch (err) {
      console.error("Error updating user:", err);
      throw err;
    }
  }
}

module.exports = Auth;
