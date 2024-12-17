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

          return {
            courseId: course.course_id,
            name: course.name,
            credits: course.credits,
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

      // Step 2: Fetch enrolled courses for the user from the `enrollments` table
      const enrollmentQuery = `SELECT course_id FROM enrollments WHERE user_id = ?`;
      const [enrollmentRows] = await db.execute(enrollmentQuery, [userId]);

      const courseIds = enrollmentRows.map(
        (enrollment) => enrollment.course_id
      );

      if (courseIds.length === 0) {
        return {
          success: true,
          data: [],
        };
      }

      // Step 3: Fetch course details and schedules for enrolled courses
      const placeholders = courseIds.map(() => "?").join(", ");
      const courseQuery = `SELECT course_id, name, credits FROM courses WHERE course_id IN (${placeholders})`;
      const [courseRows] = await db.execute(courseQuery, courseIds);

      const courseDetails = await Promise.all(
        courseRows.map(async (course) => {
          const scheduleQuery = `SELECT id, location_id, days, start_time, end_time FROM schedules WHERE course_id = ?`;
          const [scheduleRows] = await db.execute(scheduleQuery, [
            course.course_id,
          ]);

          return {
            courseId: course.course_id,
            name: course.name,
            credits: course.credits,
            schedules: scheduleRows, // Include schedules (may be empty)
          };
        })
      );

      return {
        success: true,
        data: courseDetails,
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
