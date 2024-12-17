const express = require("express");
const router = express.Router();
const macaddressesController = require("../controllers/MAC/macaddressesController");
const jwtMiddleware = require("../middleware/auth"); // Assuming you have this middleware

router.get("/", macaddressesController.getMAC);

module.exports = router;
