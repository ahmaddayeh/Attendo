const Attendance = require("../../models/Attendance"); // Adjust the path as necessary

exports.modifyAttendace = async (req, res) => {
  try {
    const { user_id, session_id, attendance_status } = req.body;

    const attendance = await Attendance.update({
      user_id,
      session_id,
      attendance_status,
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
