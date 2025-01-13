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
  static async getAttendanceBySectionAndUser(data) {
    try {
      const { section_id, user_id } = data;

      // Retrieve active attendance sessions for the section
      const query = `
        SELECT a.user_id, a.session_id, a.attendance_status, a.created_at, a.updated_at 
        FROM attendance a
        JOIN attendance_sessions s ON a.session_id = s.id
        WHERE s.schedule_id = ? AND a.user_id = ? AND s.active = 1 AND a.attendance_status != 0
      `;

      const [attendanceRecords] = await db.execute(query, [
        section_id,
        user_id,
      ]);

      return attendanceRecords;
    } catch (err) {
      console.error("Error retrieving attendance for section and user:", err);
      throw err;
    }
  }
  static async getAttendanceForUserBySchedule(data) {
    try {
      const { schedule_id, user_id } = data;

      // Query to get active sessions for a given schedule_id and user_id
      const query = `
        SELECT 
          attendance_sessions.id AS id,
          attendance_sessions.schedule_id,
          attendance_sessions.date,
          attendance_sessions.active,
          attendance.attendance_status
        FROM 
          attendance_sessions
        JOIN 
          attendance ON attendance_sessions.id = attendance.session_id
        WHERE 
          attendance_sessions.schedule_id = ? 
          AND attendance.user_id = ? 
          AND attendance_sessions.active = 1 
          AND attendance.attendance_status = 0
      `;

      const [rows] = await db.execute(query, [schedule_id, user_id]);

      if (rows.length === 0) {
        return {
          success: false,
          message: "No active attendance session found for this user.",
        };
      }

      return {
        success: true,
        data: rows,
      };
    } catch (err) {
      console.error(
        "Error retrieving attendance for user by schedule_id:",
        err
      );
      throw err;
    }
  }
}

module.exports = AttendanceSession;
