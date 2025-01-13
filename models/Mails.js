const db = require("../config/dbConnection");

class Course {
  static async getTeacherEmail(data) {
    const { courseName } = data; // Destructure input

    try {
      const courseQuery = "SELECT course_id FROM courses WHERE name = ?";
      const [courseResult] = await db.execute(courseQuery, [courseName]);

      if (courseResult.length === 0) {
        return { success: false, message: "Course not found" };
      }

      const courseId = courseResult[0].course_id;

      const enrolmentQuery =
        "SELECT user_id FROM enrollments WHERE course_id = ? AND type = 1";
      const [enrolmentResult] = await db.execute(enrolmentQuery, [courseId]);

      if (enrolmentResult.length === 0) {
        return { success: false, message: "No teacher found for this course" };
      }

      const userId = enrolmentResult[0].user_id;

      // Step 3: Get the email of the user from the users table
      const userQuery = "SELECT email FROM users WHERE user_id = ?";
      const [userResult] = await db.execute(userQuery, [userId]);

      if (userResult.length === 0) {
        return { success: false, message: "User not found" };
      }

      const email = userResult[0].email;

      return { success: true, email };
    } catch (err) {
      console.error("Error retrieving teacher email:", err);
      throw err;
    }
  }
}

module.exports = Course;
