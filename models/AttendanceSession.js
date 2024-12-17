const db = require("../config/dbConnection");

class AttendanceSession {
  static async create(data) {
    try {
      const { schedule_id, date, active } = data;

      // Insert into attendance_sessions
      const query =
        "INSERT INTO attendance_sessions (schedule_id, date, active) VALUES (?, ?, ?)";
      const [result] = await db.execute(query, [schedule_id, date, active]);

      const sessionId = result.insertId;

      // Fetch enrollments for the given schedule_id (assuming schedule_id links to enrollments)
      const enrollmentsQuery =
        "SELECT id, user_id, type, course_id FROM enrollments WHERE course_id = ?";
      const [enrollments] = await db.execute(enrollmentsQuery, [schedule_id]);

      // Prepare attendance records
      const attendanceRecords = enrollments.map((enrollment) => [
        enrollment.user_id,
        sessionId,
        0, // attendance_status = 0
        new Date(), // created_at
        new Date(), // updated_at
      ]);

      if (attendanceRecords.length > 0) {
        // Bulk insert into attendance table
        const attendanceInsertQuery =
          "INSERT INTO attendance (user_id, session_id, attendance_status, created_at, updated_at) VALUES ?";
        await db.query(attendanceInsertQuery, [attendanceRecords]);
      }

      return {
        data: {
          id: sessionId,
          schedule_id,
          date,
          active,
        },
        success: true,
      };
    } catch (err) {
      console.error("Error creating attendance session:", err);
      throw err;
    }
  }

  static async update(data) {
    try {
      const { id, active } = data;
      const query = "UPDATE attendance_sessions SET active = ? WHERE id = ?";
      const [result] = await db.execute(query, [active, id]);
      if (result.affectedRows === 0) {
        return { success: false };
      }
      return {
        success: true,
      };
    } catch (err) {
      console.error("Error updating attendance session:", err);
      throw err;
    }
  }

  static async getSessionsBySchduleId(data) {
    try {
      const { id } = data;
      const query = "SELECT * FROM attendance_sessions WHERE schedule_id = ?";
      const [rows] = await db.execute(query, [id]);
      return rows;
    } catch (err) {
      console.error("Error retrieving sessions by schedule_id:", err);
      throw err;
    }
  }
}

module.exports = AttendanceSession;
