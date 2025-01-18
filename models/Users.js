const db = require("../config/dbConnection");

class User {
  static async findDetails(data) {
    const { id } = data;
    try {
      const userQuery = `SELECT user_id, email, first_name, last_name FROM users WHERE id = ?`;
      const [userRows] = await db.execute(userQuery, [id]);

      if (userRows.length === 0) {
        throw new Error("User not found");
      }

      const user = userRows[0];

      const enrollmentQuery = `SELECT course_id, type FROM enrollments WHERE user_id = ?`;
      const [enrollmentRows] = await db.execute(enrollmentQuery, [
        user.user_id,
      ]);

      const courseIds = enrollmentRows.map(
        (enrollment) => enrollment.course_id
      );
      const userType = enrollmentRows.some(
        (enrollment) => enrollment.type !== 0
      )
        ? "Instructor"
        : "Student";

      if (courseIds.length === 0) {
        return {
          success: true,
          data: {
            id: user.user_id,
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            totalCredits: 0,
            role: userType,
            numberOfCourses: 0,
            numberOfMissedSessions: 0,
          },
        };
      }

      const placeholders = courseIds.map(() => "?").join(", ");
      const courseQuery = `SELECT SUM(credits) AS totalCredits FROM courses WHERE course_id IN (${placeholders})`;
      const [creditRows] = await db.execute(courseQuery, courseIds);

      const totalCredits = creditRows[0]?.totalCredits || 0;

      const missedSessionsQuery = `
        SELECT COUNT(*) AS missedSessions
        FROM attendance
        WHERE user_id = ? AND attendance_status = 0`;
      const [missedSessionRows] = await db.execute(missedSessionsQuery, [
        user.user_id,
      ]);

      const numberOfMissedSessions = missedSessionRows[0]?.missedSessions || 0;

      return {
        success: true,
        data: {
          id: user.user_id,
          name: `${user.first_name} ${user.last_name}`,
          email: user.email,
          totalCredits,
          role: userType,
          numberOfCourses: courseIds.length,
          numberOfMissedSessions,
        },
      };
    } catch (error) {
      console.error("Error in findDetails:", error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

module.exports = User;
