const express = require("express");
const router = express.Router();
const authController = require("../controllers/Authentication/authController");
const jwtMiddleware = require("../middleware/auth"); // Assuming you have this middleware

router.post("/login", authController.login);
router.post("/register", authController.register);

module.exports = router;
