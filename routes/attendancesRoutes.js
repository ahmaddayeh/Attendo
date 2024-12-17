const express = require("express");
const router = express.Router();
const attendancesController = require("../controllers/Attendance/attendancesController");
const jwtMiddleware = require("../middleware/auth");

router.get("/:id", attendancesController.getAttendanceById);

router.put("/", attendancesController.modifyAttendace);

module.exports = router;
