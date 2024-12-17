const express = require("express");
const router = express.Router();
const attendanceSessionsController = require("../controllers/Attendance Session/attendanceSessionsController");
const jwtMiddleware = require("../middleware/auth"); // Assuming you have this middleware

router.post("/", attendanceSessionsController.createSession);

router.get("/:id", attendanceSessionsController.getSessionsBySchduleId);

router.put("/:id", attendanceSessionsController.modifySession);

module.exports = router;
