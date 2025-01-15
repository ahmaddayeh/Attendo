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

      const [rows] = await db.execute(query, [id]);
      console.log("Query Result:", rows);

      if (!rows || rows.length === 0) {
        return {
          data: null,
          success: false,
          message: "No records found for the given session ID",
        };
      }

      const formattedData = rows.map((row) => ({
        id: row.id,
        user_id: row.user_id,
        first_name: row.first_name,
        last_name: row.last_name,
        attendance_status: row.attendance_status,
        attendance_status_literal: this.getAttendanceStatusLiteral(
          row.attendance_status
        ),
        date: row.created_at.toISOString().split("T")[0],
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

  static async findByUserIdAndScheduleId(data) {
    try {
      if (!data || !data.id || !data.schedule) {
        return {
          data: null,
          success: false,
          message: "Invalid input: User ID and Schedule ID are required",
        };
      }

      const { id, schedule } = data;

      const query = `
        SELECT 
            attendance.session_id, 
            attendance.attendance_status, 
            attendance_sessions.schedule_id, 
            attendance_sessions.date, 
            attendance_sessions.active, 
            users.first_name, 
            users.last_name 
        FROM 
            attendance
        INNER JOIN 
            attendance_sessions 
        ON 
            attendance.session_id = attendance_sessions.id
        INNER JOIN 
            users 
        ON 
            attendance.user_id = users.user_id
        WHERE 
            attendance.user_id = ? 
            AND attendance_sessions.schedule_id = ?
            AND attendance_sessions.active = 0`;

      const [rows] = await db.execute(query, [id, schedule]);
      console.log("Query Result:", rows);

      if (!rows || rows.length === 0) {
        return {
          data: null,
          success: false,
          message: "No records found for the given user and schedule ID",
        };
      }

      const formattedData = rows.map((row) => ({
        session_id: row.session_id,
        attendance_status: row.attendance_status,
        attendance_status_literal: this.getAttendanceStatusLiteral(
          row.attendance_status
        ),
        schedule_id: row.schedule_id,
        date: row.date.toISOString().split("T")[0],
        active: row.active,
      }));
      console.log(formattedData);

      return {
        data: formattedData,
        success: true,
      };
    } catch (err) {
      console.error(
        "Error finding attendance by user ID and schedule ID:",
        err.message
      );
      return {
        data: null,
        success: false,
        message: "An error occurred while retrieving attendance data",
      };
    }
  }

  static getAttendanceStatusLiteral(status) {
    switch (status) {
      case 0:
        return "absent";
      case 1:
        return "excused";
      case 2:
        return "late";
      case 3:
        return "present";
      default:
        return "unknown";
    }
  }
}

module.exports = Attendance;
