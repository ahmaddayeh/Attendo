const db = require("../config/dbConnection");

class Course {
  // Get all courses and their schedules
  static async getAll() {
    try {
      const courseQuery = `SELECT course_id, name, credits FROM courses`;
      const [courseRows] = await db.execute(courseQuery);

      if (courseRows.length === 0) {
        return {
          success: true,
          data: [],
        };
      }

      const courseDetails = await Promise.all(
        courseRows.map(async (course) => {
          const scheduleQuery = `SELECT id, location_id, days, start_time, end_time FROM schedules WHERE course_id = ?`;
          const [scheduleRows] = await db.execute(scheduleQuery, [
            course.course_id,
          ]);

          const enrollmentQuery = `SELECT type FROM enrollments WHERE course_id = ?`;
          const [enrollmentRows] = await db.execute(enrollmentQuery, [
            course.course_id,
          ]);

          const enrollmentType =
            enrollmentRows.length > 0 ? enrollmentRows[0].type : null;

          return {
            courseId: course.course_id,
            name: course.name,
            credits: course.credits,
            enrollmentType, // Add enrollment type
            schedules: scheduleRows, // Include schedules (may be empty)
          };
        })
      );

      return {
        success: true,
        data: courseDetails,
      };
    } catch (error) {
      console.error("Error in getAll:", error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Get courses and schedules by user ID
  static async getByUser(data) {
    const { id } = data; // Destructure input

    try {
      // Step 1: Fetch the user_id using the id from JWT
      const userQuery = `SELECT user_id FROM users WHERE id = ?`;
      const [userRows] = await db.execute(userQuery, [id]);

      if (userRows.length === 0) {
        throw new Error("User not found");
      }

      const userId = userRows[0].user_id;

      // Step 2: Fetch enrolled courses and their types for the user from the `enrollments` table
      const enrollmentQuery = `SELECT course_id, type FROM enrollments WHERE user_id = ?`;
      const [enrollmentRows] = await db.execute(enrollmentQuery, [userId]);

      const courseDetails = await Promise.all(
        enrollmentRows.map(async (enrollment) => {
          const courseQuery = `SELECT course_id, name, credits FROM courses WHERE course_id = ?`;
          const [courseRows] = await db.execute(courseQuery, [
            enrollment.course_id,
          ]);

          if (courseRows.length === 0) {
            return null;
          }

          const course = courseRows[0];

          const scheduleQuery = `SELECT id, location_id, days, start_time, end_time FROM schedules WHERE course_id = ?`;
          const [scheduleRows] = await db.execute(scheduleQuery, [
            course.course_id,
          ]);

          return {
            courseId: course.course_id,
            name: course.name,
            credits: course.credits,
            enrollmentType: enrollment.type, // Add enrollment type
            schedules: scheduleRows, // Include schedules (may be empty)
          };
        })
      );

      return {
        success: true,
        data: courseDetails.filter((course) => course !== null), // Filter out any null courses
      };
    } catch (error) {
      console.error("Error in getByUser:", error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

module.exports = Course;
