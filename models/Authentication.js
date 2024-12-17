const db = require("../config/dbConnection");

class Auth {
  static async create(userData) {
    try {
      const { first_name, last_name, email, password, role } = userData;
      const query =
        "INSERT INTO users (first_name, last_name, email, password, role) VALUES (?, ?, ?, ?, ?)";
      const [result] = await db
        .promise()
        .execute(query, [first_name, last_name, email, password, role]);
      return { id: result.insertId, first_name, last_name, email, role };
    } catch (err) {
      console.error("Error creating user:", err);
      throw err;
    }
  }

  static async findbyEmail(email) {
    try {
      const query = "SELECT * FROM users WHERE email = ?";
      const [rows] = await db.execute(query, [email]);
      return { found: true, data: rows[0] };
    } catch (err) {
      console.error("Error fetching user by email:", err);
      throw err;
    }
  }
  static async findById(id) {
    try {
      const query = "SELECT * FROM users WHERE id = ?";
      const [rows] = await db.promise().execute(query, [id]);
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
      await db.promise().execute(query, [first_name, last_name, id]);
      return { id, first_name, last_name };
    } catch (err) {
      console.error("Error updating user:", err);
      throw err;
    }
  }

  static async delete(id) {
    try {
      const query = "DELETE FROM users WHERE id = ?";
      await db.promise().execute(query, [id]);
    } catch (err) {
      console.error("Error deleting user:", err);
      throw err;
    }
  }
}

module.exports = Auth;
