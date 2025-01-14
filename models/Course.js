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

      const courseDetails = [];

      for (const course of courseRows) {
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

        if (scheduleRows.length > 0) {
          scheduleRows.forEach((schedule) => {
            courseDetails.push({
              courseId: course.course_id,
              name: course.name,
              credits: course.credits,
              enrollmentType,
              scheduleId: schedule.id,
              locationId: schedule.location_id,
              days: schedule.days,
              startTime: schedule.start_time,
              endTime: schedule.end_time,
            });
          });
        } else {
          // If no schedules, include the course without schedule details
          courseDetails.push({
            courseId: course.course_id,
            name: course.name,
            credits: course.credits,
            enrollmentType,
            scheduleId: null,
            locationId: null,
            days: null,
            startTime: null,
            endTime: null,
          });
        }
      }

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
    const { id } = data;

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

      const courseDetails = [];

      for (const enrollment of enrollmentRows) {
        const courseQuery = `SELECT course_id, name, credits FROM courses WHERE course_id = ?`;
        const [courseRows] = await db.execute(courseQuery, [
          enrollment.course_id,
        ]);

        if (courseRows.length === 0) {
          continue;
        }

        const course = courseRows[0];

        const scheduleQuery = `SELECT id, location_id, days, start_time, end_time FROM schedules WHERE course_id = ?`;
        const [scheduleRows] = await db.execute(scheduleQuery, [
          course.course_id,
        ]);

        if (scheduleRows.length > 0) {
          scheduleRows.forEach((schedule) => {
            courseDetails.push({
              courseId: course.course_id,
              name: course.name,
              credits: course.credits,
              enrollmentType: enrollment.type,
              scheduleId: schedule.id,
              locationId: schedule.location_id,
              days: schedule.days,
              startTime: schedule.start_time,
              endTime: schedule.end_time,
            });
          });
        } else {
          // If no schedules, include the course without schedule details
          courseDetails.push({
            courseId: course.course_id,
            name: course.name,
            credits: course.credits,
            enrollmentType: enrollment.type,
            scheduleId: null,
            locationId: null,
            days: null,
            startTime: null,
            endTime: null,
          });
        }
      }

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
