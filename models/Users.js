const db = require("../config/dbConnection");

class User {
  static async findDetails(data) {
    const { id } = data; // Destructure input
    try {
      // Step 1: Get user details and user_id from the `users` table
      const userQuery = `SELECT user_id, first_name, last_name FROM users WHERE id = ?`;
      const [userRows] = await db.execute(userQuery, [id]);

      if (userRows.length === 0) {
        throw new Error("User not found");
      }

      const user = userRows[0];

      // Step 2: Get enrolled courses and type from the `enrollments` table using user_id
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

      // Handle case when courseIds is empty
      if (courseIds.length === 0) {
        return {
          success: true,
          data: {
            id: user.user_id,
            name: `${user.first_name} ${user.last_name}`,
            totalCredits: 0,
            role: userType,
            numberOfCourses: 0,
            numberOfMissedSessions: 0,
          },
        };
      }

      // Step 3: Get total credits for the courses from the `courses` table
      const placeholders = courseIds.map(() => "?").join(", ");
      const courseQuery = `SELECT SUM(credits) AS totalCredits FROM courses WHERE course_id IN (${placeholders})`;
      const [creditRows] = await db.execute(courseQuery, courseIds);

      const totalCredits = creditRows[0]?.totalCredits || 0;

      // Step 4: Count missed sessions from the `attendance` table
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
