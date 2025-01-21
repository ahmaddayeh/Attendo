const express = require("express");
const router = express.Router();
const absencesController = require("../controllers/Absence/absencesController");

router.get("/requests/:user_id", absencesController.getAbsenceRequestsByUserId);

router.post("/requests/", absencesController.createAbsenceRequest);

router.put("/requests/:id", absencesController.updateAbsenceRequest);
module.exports = router;
