const db = require("../config/dbConnection");

class MAC {
  static async getAll() {
    try {
      const query = `SELECT id, room, mac_address FROM locations`;
      const [rows] = await db.execute(query);

      if (rows.length === 0) {
        return { success: true, data: [] };
      }

      return { success: true, data: rows };
    } catch (error) {
      console.error("Error fetching MAC data:", error);
      return { success: false, error: error.message };
    }
  }

  static async getRoomId(data) {
    try {
      const { id } = data;
      const query = `SELECT id, room, mac_address FROM locations WHERE id = ?`;
      const [rows] = await db.execute(query, [id]);

      if (rows.length === 0) {
        return { success: false, message: "No data found for the given ID" };
      }

      return { success: true, data: rows[0] };
    } catch (error) {
      console.error("Error fetching room by ID:", error);
      return { success: false, error: error.message };
    }
  }

  static async getByRoomName(data) {
    try {
      const { room } = data;
      const query = `SELECT id, room, mac_address FROM locations WHERE room = ?`;
      const [rows] = await db.execute(query, [room]);

      if (rows.length === 0) {
        return { success: false, message: "No data found for the given room" };
      }

      return { success: true, data: rows[0] };
    } catch (error) {
      console.error("Error fetching room by name:", error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = MAC;
