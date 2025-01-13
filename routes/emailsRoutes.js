const express = require("express");
const router = express.Router();
const emailsController = require("../controllers/Email/emailsController");

router.post("/", emailsController.sendMail);

module.exports = router;
