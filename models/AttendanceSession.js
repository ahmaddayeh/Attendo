const db = require("../config/dbConnection");

class AttendanceSession {
  static async create(data) {
    try {
      const { schedule_id, date, active } = data;

      const courseQuery = "SELECT course_id FROM schedules WHERE id = ?";
      const [courseResult] = await db.execute(courseQuery, [schedule_id]);

      if (!courseResult || courseResult.length === 0) {
        throw new Error("Schedule not found");
      }

      const course_id = courseResult[0].course_id;

      const query =
        "INSERT INTO attendance_sessions (schedule_id, date, active) VALUES (?, ?, ?)";
      const [result] = await db.execute(query, [schedule_id, date, active]);

      const sessionId = result.insertId;

      const enrollmentsQuery =
        "SELECT id, user_id, type, course_id FROM enrollments WHERE course_id = ?";
      const [enrollments] = await db.execute(enrollmentsQuery, [course_id]);

      const absenceRequestsQuery =
        "SELECT id, user_id, is_approved FROM absence_requests WHERE schedule_id = ?";
      const [absenceRequests] = await db.execute(absenceRequestsQuery, [
        schedule_id,
      ]);

      const attendanceRecords = enrollments.map((enrollment) => {
        const absenceRequest = absenceRequests.find(
          (request) => request.user_id === enrollment.user_id
        );

        if (absenceRequest && absenceRequest.is_approved === 2) {
          return [enrollment.user_id, sessionId, 1, new Date(), new Date()];
        } else {
          return [enrollment.user_id, sessionId, 0, new Date(), new Date()];
        }
      });

      const absenceRequestIdsToDelete = absenceRequests
        .filter((request) => request.is_approved === 2)
        .map((request) => request.id);

      console.log("IDs to delete:", absenceRequestIdsToDelete);

      if (absenceRequestIdsToDelete.length > 0) {
        const placeholders = absenceRequestIdsToDelete
          .map(() => "?")
          .join(", ");
        const deleteAbsenceRequestsQuery = `DELETE FROM absence_requests WHERE id IN (${placeholders})`;

        await db.execute(deleteAbsenceRequestsQuery, absenceRequestIdsToDelete);
      }

      if (attendanceRecords.length > 0) {
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
      const query =
        "SELECT id, schedule_id, DATE_FORMAT(date, '%Y-%m-%d') as date, active FROM attendance_sessions WHERE schedule_id = ?";
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

      const query = `
        SELECT a.user_id, a.session_id, a.attendance_status, DATE_FORMAT(a.created_at, '%Y-%m-%d') as created_at, DATE_FORMAT(a.updated_at, '%Y-%m-%d') as updated_at 
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

      const query = `
        SELECT 
          attendance_sessions.id AS id,
          attendance_sessions.schedule_id,
          DATE_FORMAT(attendance_sessions.date, '%Y-%m-%d') as date,
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
