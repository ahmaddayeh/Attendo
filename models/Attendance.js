const db = require("../config/dbConnection");

class Absence {
  static async findByScheduleId(data) {
    const { id } = data;
    try {
      const query = `
        SELECT 
          ar.id, 
          ar.user_id, 
          ar.schedule_id, 
          ar.is_approved, 
          CONCAT_WS(' ', u.first_name, u.last_name) AS full_name
        FROM 
          absence_requests ar
        LEFT JOIN 
          users u ON ar.user_id = u.user_id
        WHERE 
          ar.schedule_id = ?
      `;
      const [result] = await db.execute(query, [id]);

      const absences = result || [];

      const response = {
        success: true,
        data: {
          totalAbsencesRquests: absences.length,
          absenceRequestDetails: absences.map((absence) => ({
            id: absence.id,
            userId: absence.user_id,
            scheduleId: absence.schedule_id,
            approvalStatus: absence.is_approved,
            userFullName: absence.full_name || "Unknown User",
          })),
        },
      };

      return response;
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
        VALUES (?, ?, ?)
      `;
      const [result] = await db.execute(query, [
        user_id,
        schedule_id,
        is_approved,
      ]);

      if (result.affectedRows > 0) {
        const response = {
          success: true,
          data: {
            id: result.insertId,
            user_id,
            schedule_id,
            is_approved,
          },
        };
        return response;
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
      const query = `
        UPDATE absence_requests
        SET is_approved = ?
        WHERE id = ?
      `;
      const [result] = await db.execute(query, [is_approved, id]);

      if (result.affectedRows > 0) {
        const selectQuery = `
          SELECT 
            ar.id, 
            ar.user_id, 
            ar.schedule_id, 
            ar.is_approved
          FROM 
            absence_requests ar
          WHERE 
            ar.id = ?
        `;
        const [updatedAbsence] = await db.execute(selectQuery, [id]);
        const absence = updatedAbsence[0];

        const response = {
          success: true,
          data: {
            id: absence.id,
            user_id: absence.user_id,
            schedule_id: absence.schedule_id,
            is_approved: absence.is_approved,
          },
        };
        return response;
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
