const express = require("express");
const router = express.Router();
const macaddressesController = require("../controllers/MAC/macaddressesController");

router.get("/", macaddressesController.getMAC);

module.exports = router;
