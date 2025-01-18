const express = require("express");
const router = express.Router();
const usersController = require("../controllers/Users/usersController");
const jwtMiddleware = require("../middleware/auth");

router.get("/me", jwtMiddleware, usersController.getByMe);

module.exports = router;
