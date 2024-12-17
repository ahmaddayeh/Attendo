const db = require("../config/dbConnection");

class Attendance {
  static async update(data) {
    try {
      const { user_id, session_id, attendance_status } = data;
      const query =
        "UPDATE attendance SET attendance_status = ? WHERE user_id = ? AND session_id = ?";
      const [result] = await db.execute(query, [
        attendance_status,
        user_id,
        session_id,
      ]);
      if (result.affectedRows === 0) {
        return { success: false };
      }
      return {
        success: true,
      };
    } catch (err) {
      console.error("Error updating attendance:", err);
      throw err;
    }
  }

  static async findBySessionId(data) {
    try {
      // Validate input
      if (!data || !data.id) {
        return {
          data: null,
          success: false,
          message: "Invalid input: Session ID is required",
        };
      }

      const { id } = data;
      console.log("Session ID:", id);

      const query = `
        SELECT 
            attendance.*, 
            users.first_name, 
            users.last_name 
        FROM 
            attendance
        INNER JOIN 
            users 
        ON 
            attendance.user_id = users.user_id
        WHERE 
            attendance.session_id = ?`;

      // Execute query
      const [rows] = await db.execute(query, [id]);
      console.log("Query Result:", rows);

      // Check if records exist
      if (!rows || rows.length === 0) {
        return {
          data: null,
          success: false,
          message: "No records found for the given session ID",
        };
      }

      // Transform data into the desired structure
      const formattedData = rows.map((row) => ({
        id: row.id,
        user: {
          user_id: row.user_id,
          first_name: row.first_name,
          last_name: row.last_name,
        },
        attendance_status: row.attendance_status,
        date: row.created_at,
      }));

      return {
        data: formattedData,
        success: true,
      };
    } catch (err) {
      console.error("Error finding session by ID:", err.message);
      return {
        data: null,
        success: false,
        message: "An error occurred while retrieving attendance data",
      };
    }
  }
}

module.exports = Attendance;
