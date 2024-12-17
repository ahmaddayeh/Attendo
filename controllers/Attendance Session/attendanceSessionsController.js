const AttendanceSession = require("../../models/AttendanceSession"); // Adjust the path as necessary
exports.createSession = async (req, res) => {
  try {
    const { schedule_id, date, active } = req.body;
    const session = await AttendanceSession.create({
      schedule_id,
      date,
      active,
    });

    if (session.success == true) {
      res.status(200).json({
        session: session.data,
        success: true,
        message: "Session created successfully",
      });
    } else {
      return res.status(404).json({ error: "Session not created" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

exports.modifySession = async (req, res) => {
  try {
    const { id } = req.params;
    const { active } = req.body;
    const session = await AttendanceSession.update({ id, active });

    console.log(session);

    if (session.success == true) {
      res.status(200).json({
        session: session.data,
        success: true,
        message: "Session updated successfully",
      });
    } else {
      return res.status(404).json({ error: "Session not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};
exports.getSessionsBySchduleId = async (req, res) => {
  try {
    const { id } = req.params;

    console.log(id);
    const sessions = await AttendanceSession.getSessionsBySchduleId({
      id,
    });

    if (sessions.length > 0) {
      res.status(200).json({
        sessions,
        success: true,
        message: "Sessions retrieved successfully",
      });
    } else {
      return res
        .status(404)
        .json({ error: "No sessions found for this course" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};
