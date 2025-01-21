const db = require("../config/dbConnection");

class Absence {
  static async findByUserId(data) {
    const { id } = data;
    try {
      const enrolmentQuery = `
        SELECT 
          e.course_id
        FROM 
          enrollments e
        WHERE 
          e.user_id = ?`;
      const [enrolments] = await db.execute(enrolmentQuery, [id]);

      if (!enrolments.length) {
        return {
          success: false,
          error: "No enrolments found for this instructor.",
          data: null,
        };
      }

      const courseIds = enrolments.map((enrolment) => enrolment.course_id);
      const courseIdsPlaceholders = courseIds.map(() => "?").join(",");
      const scheduleQuery = `
        SELECT 
          s.id AS schedule_id,
          s.course_id,
          c.name AS course_name,
          s.location_id,
          s.days,
          s.start_time,
          s.end_time
        FROM 
          schedules s
        JOIN 
          courses c ON s.course_id = c.course_id
        WHERE 
          s.course_id IN (${courseIdsPlaceholders})
        ORDER BY 
          s.id`;
      const [schedules] = await db.execute(scheduleQuery, courseIds);

      if (!schedules.length) {
        return {
          success: false,
          error: "No schedule details found for the instructor's courses.",
          data: null,
        };
      }

      const scheduleIds = schedules.map((schedule) => schedule.schedule_id);
      const scheduleIdsPlaceholders = scheduleIds.map(() => "?").join(",");
      const absenceQuery = `
        SELECT 
          ar.id AS absence_id, 
          ar.user_id, 
          ar.schedule_id, 
          ar.is_approved, 
          CONCAT_WS(' ', u.first_name, u.last_name) AS user_full_name
        FROM 
          absence_requests ar
        LEFT JOIN 
          users u ON ar.user_id = u.user_id
        WHERE 
          ar.schedule_id IN (${scheduleIdsPlaceholders})
          AND ar.is_approved = 0`;
      const [absences] = await db.execute(absenceQuery, scheduleIds);

      // Filter schedules to only include those with associated absences
      const responseData = schedules
        .filter((schedule) =>
          absences.some(
            (absence) => absence.schedule_id === schedule.schedule_id
          )
        )
        .map((schedule) => {
          const relatedAbsences = absences.filter(
            (absence) => absence.schedule_id === schedule.schedule_id
          );
          return relatedAbsences.map((absence) => ({
            scheduleId: schedule.schedule_id,
            courseId: schedule.course_id,
            courseName: schedule.course_name,
            locationId: schedule.location_id,
            days: schedule.days,
            startTime: schedule.start_time,
            endTime: schedule.end_time,
            absenceId: absence.absence_id,
            userId: absence.user_id,
            approvalStatus: absence.is_approved,
            userFullName: absence.user_full_name || "Unknown User",
          }));
        })
        .flat();

      return {
        success: true,
        data: {
          totalAbsencesRequests: absences.length,
          schedules: responseData,
        },
      };
    } catch (error) {
      console.error("Error fetching absences:", error.message);
      return {
        success: false,
        error: error.message,
        data: null,
      };
    }
  }

  static async create(data) {
    const { user_id, schedule_id, is_approved } = data;
    try {
      const query = `
        INSERT INTO absence_requests (user_id, schedule_id, is_approved)
        VALUES (?, ?, ?)`;
      const [result] = await db.execute(query, [
        user_id,
        schedule_id,
        is_approved,
      ]);

      if (result.affectedRows > 0) {
        return {
          success: true,
          data: {
            id: result.insertId,
            user_id,
            schedule_id,
            is_approved,
          },
        };
      } else {
        throw new Error("Failed to create absence request");
      }
    } catch (error) {
      console.error("Error creating absence:", error.message);
      return {
        success: false,
        error: error.message,
        data: null,
      };
    }
  }

  static async updateApprovalStatus(data) {
    const { id, is_approved } = data;
    try {
      const updateQuery = `
        UPDATE absence_requests
        SET is_approved = ?
        WHERE id = ?`;
      const [updateResult] = await db.execute(updateQuery, [is_approved, id]);

      if (updateResult.affectedRows > 0) {
        const selectQuery = `
          SELECT 
            ar.id, 
            ar.user_id, 
            ar.schedule_id, 
            ar.is_approved
          FROM 
            absence_requests ar
          WHERE 
            ar.id = ?`;
        const [updatedAbsence] = await db.execute(selectQuery, [id]);

        const absence = updatedAbsence[0];
        return {
          success: true,
          data: {
            id: absence.id,
            user_id: absence.user_id,
            schedule_id: absence.schedule_id,
            is_approved: absence.is_approved,
          },
        };
      } else {
        throw new Error("Absence request not found");
      }
    } catch (error) {
      console.error("Error updating absence:", error.message);
      return {
        success: false,
        error: error.message,
        data: null,
      };
    }
  }
}

module.exports = Absence;
