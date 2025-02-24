const express = require("express");
const router = express.Router();
const attendanceSessionsController = require("../controllers/Attendance Session/attendanceSessionsController");

router.post("/", attendanceSessionsController.createSession);

router.get("/:id", attendanceSessionsController.getSessionsBySchduleId);

router.get(
  "/:user_id/:schedule_id",
  attendanceSessionsController.getAttendanceForUserBySchedule
);

router.put("/:id", attendanceSessionsController.modifySession);

module.exports = router;
