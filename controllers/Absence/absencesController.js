const Absence = require("../../models/Absence");

exports.getAbsenceRequestsByUserId = async (req, res) => {
  try {
    const { user_id } = req.params;

    const absence = await Absence.findByUserId({ id: user_id });

    if (absence.success) {
      res.status(200).json({
        absence_list: absence.data,
        success: true,
        message: "Absence requests retrieved successfully",
      });
    } else {
      res.status(404).json({ error: "absence list not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.createAbsenceRequest = async (req, res) => {
  try {
    const { user_id, schedule_id } = req.body;

    if (!user_id || !schedule_id) {
      return res
        .status(400)
        .json({ error: "user_id and schedule_id are required" });
    }

    const absence = await Absence.create({
      user_id: user_id,
      schedule_id: schedule_id,
      is_approved: 0,
    });

    if (absence.success) {
      res.status(201).json({
        success: true,
        message: "Absence request created successfully",
        data: absence.data,
      });
    } else {
      res
        .status(400)
        .json({ error: absence.message || "Error creating absence request" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateAbsenceRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_approved } = req.body;

    if (is_approved === undefined) {
      return res
        .status(400)
        .json({ error: "Approval status (is_approved) is required" });
    }

    const absence = await Absence.updateApprovalStatus({ id, is_approved });

    if (absence.success) {
      res.status(200).json({
        success: true,
        message: "Absence request updated successfully",
        data: absence.data,
      });
    } else {
      res
        .status(404)
        .json({ error: absence.message || "Absence request not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
