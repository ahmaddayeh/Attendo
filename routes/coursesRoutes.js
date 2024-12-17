const express = require("express");
const router = express.Router();
const coursesController = require("../controllers/Courses/coursesController");
const jwtMiddleware = require("../middleware/auth"); // Assuming you have this middleware

router.get("/", coursesController.getCourses);

module.exports = router;
