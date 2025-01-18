const express = require("express");
const router = express.Router();
const attendancesController = require("../controllers/Attendance/attendancesController");

router.get(
  "/user-summary/:user_id",
  attendancesController.getUserAttendanceSummary
);

router.get(
  "/schedule-user-summary/:user_id/:schedule_id",
  attendancesController.getUserCourseAttendanceSummary
);

router.get("/:id", attendancesController.getAttendanceById);

router.post("/sheet/:id", attendancesController.generateAttendanceSheet);

router.get(
  "/:id/:schedule",
  attendancesController.getAttendanceByUserIdAndScheduleId
);

router.put("/", attendancesController.modifyAttendace);

module.exports = router;
