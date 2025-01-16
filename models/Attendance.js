const db = require("../config/dbConnection");
const ExcelJS = require("exceljs");
const fs = require("fs");
const path = require("path");

class Attendance {
  static async update(data) {
    try {
      const { user_id, session_id, attendance_status } = data;
      const query =
        "UPDATE attendance SET attendance_status = ? WHERE user_id = ? AND session_id = ?";
      const [result] = await db.execute(query, [
        attendance_status,
        user_id,
        session_id,
      ]);
      if (result.affectedRows === 0) {
        return { success: false };
      }
      return {
        success: true,
      };
    } catch (err) {
      console.error("Error updating attendance:", err);
      throw err;
    }
  }

  static async findBySessionId(data) {
    try {
      if (!data || !data.id) {
        return {
          data: null,
          success: false,
          message: "Invalid input: Session ID is required",
        };
      }

      const { id } = data;
      console.log("Session ID:", id);

      const query = `
        SELECT 
            attendance.*, 
            users.first_name, 
            users.last_name 
        FROM 
            attendance
        INNER JOIN 
            users 
        ON 
            attendance.user_id = users.user_id
        WHERE 
            attendance.session_id = ?`;

      const [rows] = await db.execute(query, [id]);
      console.log("Query Result:", rows);

      if (!rows || rows.length === 0) {
        return {
          data: null,
          success: false,
          message: "No records found for the given session ID",
        };
      }

      const formattedData = rows.map((row) => ({
        id: row.id,
        user_id: row.user_id,
        first_name: row.first_name,
        last_name: row.last_name,
        attendance_status: row.attendance_status,
        attendance_status_literal: this.getAttendanceStatusLiteral(
          row.attendance_status
        ),
        date: row.created_at.toISOString().split("T")[0],
      }));

      return {
        data: formattedData,
        success: true,
      };
    } catch (err) {
      console.error("Error finding session by ID:", err.message);
      return {
        data: null,
        success: false,
        message: "An error occurred while retrieving attendance data",
      };
    }
  }

  static async findByUserIdAndScheduleId(data) {
    try {
      if (!data || !data.id || !data.schedule) {
        return {
          data: null,
          success: false,
          message: "Invalid input: User ID and Schedule ID are required",
        };
      }

      const { id, schedule } = data;

      const query = `
        SELECT 
            attendance.session_id, 
            attendance.attendance_status, 
            attendance_sessions.schedule_id, 
            attendance_sessions.date, 
            attendance_sessions.active, 
            users.first_name, 
            users.last_name 
        FROM 
            attendance
        INNER JOIN 
            attendance_sessions 
        ON 
            attendance.session_id = attendance_sessions.id
        INNER JOIN 
            users 
        ON 
            attendance.user_id = users.user_id
        WHERE 
            attendance.user_id = ? 
            AND attendance_sessions.schedule_id = ?
            AND attendance_sessions.active = 0`;

      const [rows] = await db.execute(query, [id, schedule]);
      console.log("Query Result:", rows);

      if (!rows || rows.length === 0) {
        return {
          data: null,
          success: false,
          message: "No records found for the given user and schedule ID",
        };
      }

      const formattedData = rows.map((row) => ({
        session_id: row.session_id,
        attendance_status: row.attendance_status,
        attendance_status_literal: this.getAttendanceStatusLiteral(
          row.attendance_status
        ),
        schedule_id: row.schedule_id,
        date: row.date.toISOString().split("T")[0],
        active: row.active,
      }));
      console.log(formattedData);

      return {
        data: formattedData,
        success: true,
      };
    } catch (err) {
      console.error(
        "Error finding attendance by user ID and schedule ID:",
        err.message
      );
      return {
        data: null,
        success: false,
        message: "An error occurred while retrieving attendance data",
      };
    }
  }

  static async generateSheet(schedule_id) {
    try {
      if (!schedule_id) {
        throw new Error("Schedule ID is required.");
      }

      const query = `
        SELECT 
            attendance.user_id,
            users.first_name,
            users.last_name,
            attendance_sessions.date,
            attendance.attendance_status
        FROM 
            attendance
        INNER JOIN 
            attendance_sessions 
        ON 
            attendance.session_id = attendance_sessions.id
        INNER JOIN 
            users 
        ON 
            attendance.user_id = users.user_id
        WHERE 
            attendance_sessions.schedule_id = ?`;

      const [rows] = await db.execute(query, [schedule_id]);

      if (!rows || rows.length === 0) {
        return {
          success: false,
          message: "No records found for the given schedule ID.",
        };
      }

      const userAttendance = {};
      rows.forEach((row) => {
        if (!userAttendance[row.user_id]) {
          userAttendance[row.user_id] = {
            name: `${row.first_name} ${row.last_name}`,
            sessions: [],
            summary: { present: 0, late: 0, excused: 0, absent: 0 },
          };
        }

        const statusLiteral = this.getAttendanceStatusLiteral(
          row.attendance_status
        );
        userAttendance[row.user_id].sessions.push({
          date: row.date.toISOString().split("T")[0],
          status: statusLiteral,
        });

        userAttendance[row.user_id].summary[statusLiteral]++;
      });

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Attendance");

      // Add a title row
      worksheet.mergeCells("A1:E1");
      worksheet.getCell(
        "A1"
      ).value = `Attendance Sheet for Schedule ID: ${schedule_id}`;
      worksheet.getCell("A1").font = { bold: true, size: 14 };
      worksheet.getCell("A1").alignment = { horizontal: "center" };

      // Header row
      worksheet.addRow([
        "User ID",
        "Name",
        "Date",
        "Attendance Status",
        "Present Total",
        "Late Total",
        "Excused Total",
        "Absent Total",
      ]);

      worksheet.columns = [
        { key: "user_id", width: 10 },
        { key: "name", width: 25 },
        { key: "date", width: 15 },
        { key: "status", width: 20 },
        { key: "present_total", width: 15 },
        { key: "late_total", width: 15 },
        { key: "excused_total", width: 15 },
        { key: "absent_total", width: 15 },
      ];

      // Data rows
      Object.entries(userAttendance).forEach(([user_id, data]) => {
        data.sessions.forEach((session, index) => {
          worksheet.addRow({
            user_id: index === 0 ? user_id : "", // Only show user_id once per group
            name: index === 0 ? data.name : "", // Only show name once per group
            date: session.date,
            status: session.status,
            present_total: index === 0 ? data.summary.present : "", // Show totals only on the first row of each group
            late_total: index === 0 ? data.summary.late : "",
            excused_total: index === 0 ? data.summary.excused : "",
            absent_total: index === 0 ? data.summary.absent : "",
          });
        });
      });

      // Add some styling for better readability
      worksheet.getRow(2).font = { bold: true }; // Header row
      worksheet.getRow(2).alignment = { horizontal: "center" };
      worksheet.eachRow((row, rowNumber) => {
        row.alignment = { vertical: "middle", horizontal: "center" };
        if (rowNumber > 2) {
          row.getCell(4).alignment = { horizontal: "left" }; // Status column left-aligned
        }
      });

      const exportFolder = path.join(__dirname, "../sheets");

      const fileName = `attendance_schedule_${schedule_id}_${Math.floor(
        Math.random() * 100000
      )}.xlsx`;

      const outputPath = path.join(exportFolder, fileName);

      await workbook.xlsx.writeFile(outputPath);

      console.log(`File saved as: ${fileName}`);

      return {
        success: true,
        message: `Attendance sheet generated successfully at ${outputPath}.`,
        filePath: outputPath,
        fileName: fileName,
      };
    } catch (error) {
      console.error("Error generating attendance sheet:", error.message);
      return {
        success: false,
        message: "An error occurred while generating the attendance sheet.",
      };
    }
  }

  static getAttendanceStatusLiteral(status) {
    switch (status) {
      case 0:
        return "absent";
      case 1:
        return "excused";
      case 2:
        return "late";
      case 3:
        return "present";
      default:
        return "unknown";
    }
  }
}

module.exports = Attendance;
