const Attendance = require("../../models/Attendance");
const nodemailer = require("nodemailer");

exports.modifyAttendace = async (req, res) => {
  try {
    const { user_id, session_id, attendance_status } = req.body;

    let status;
    switch (attendance_status) {
      case "absent":
        status = 0;
        break;
      case "excused":
        status = 1;
        break;
      case "late":
        status = 2;
        break;
      case "present":
        status = 3;
        break;
      default:
        status = -1;
    }

    if (status === -1) {
      return res.status(400).json({ error: "Invalid attendance status" });
    }

    const attendance = await Attendance.update({
      user_id,
      session_id,
      attendance_status: status,
    });

    if (attendance.success) {
      res.status(200).json({
        success: true,
        message: "Attendance modified successfully",
      });
    } else {
      res.status(404).json({ error: "No attendance record updated" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.getAttendanceById = async (req, res) => {
  try {
    const { id } = req.params;

    const attendance = await Attendance.findBySessionId({ id: id });

    if (attendance.success) {
      res.status(200).json({
        attendance_list: attendance.data,
        success: true,
        message: "Session retrieved successfully",
      });
    } else {
      res.status(404).json({ error: "Session not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
exports.getAttendanceByUserIdAndScheduleId = async (req, res) => {
  try {
    const { id, schedule } = req.params;
    console.log(id, schedule);

    const attendance = await Attendance.findByUserIdAndScheduleId({
      id,
      schedule,
    });

    if (attendance.success) {
      res.status(200).json({
        attendance: attendance.data,
        success: true,
        message: "Attendance retrieved successfully",
      });
    } else {
      res.status(404).json({ error: attendance.message });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.generateAttendanceSheet = async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body;

    const attendance = await Attendance.generateSheet(id);
    console.log(attendance.filePath);
    if (attendance.success) {
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const mailOptions = {
        from: "attendo@attendosystems.com",
        to: email,
        subject: "Attendance Sheet",
        text: `Please find the attendance sheet attached.`,
        attachments: [
          {
            path: attendance.filePath,
          },
        ],
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
          return res.status(500).json({ error: "Failed to send email" });
        }
        console.log("Email sent:", info.response);
        res.status(200).json({
          success: true,
          message: "Session retrieved successfully and email sent",
        });
      });
    } else {
      console.log(attendance);
      res.status(404).json({ error: "Session not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
exports.getUserAttendanceSummary = async (req, res) => {
  console.log("getUserAttendanceSummary");
  try {
    const { user_id } = req.params;

    const attendanceSummary = await Attendance.getUserAttendanceSummary(
      user_id
    );

    if (attendanceSummary.success) {
      res.status(200).json({
        success: true,
        summary: attendanceSummary.summary,
        percentages: attendanceSummary.percentages,
      });
    } else {
      res.status(404).json({ error: attendanceSummary.message });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.getUserCourseAttendanceSummary = async (req, res) => {
  console.log("getUserCourseAttendanceSummary");

  try {
    const { user_id, schedule_id } = req.params;

    const attendanceSummary = await Attendance.getUserScheduleAttendanceSummary(
      user_id,
      schedule_id
    );

    if (attendanceSummary.success) {
      res.status(200).json({
        success: true,
        summary: attendanceSummary.summary,
        percentages: attendanceSummary.percentages,
      });
    } else {
      res.status(404).json({ error: attendanceSummary.message });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
