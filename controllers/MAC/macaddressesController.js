const MAC = require("../../models/MAC");

exports.getMAC = async (req, res) => {
  try {
    const id = req.query.id || null;
    const room = req.query.room || null;

    let macData;

    if (id && room) {
      return res.status(400).json({
        success: false,
        message: "Provide either 'id' or 'room', not both.",
      });
    } else if (id) {
      macData = await MAC.getRoomId({ id: id });
    } else if (room) {
      macData = await MAC.getByRoomName({ room: room });
    } else {
      macData = await MAC.getAll();
    }

    if (macData.success) {
      res.status(200).json({
        data: macData.data,
        success: true,
        message: "Data fetched successfully",
      });
    } else {
      res.status(404).json({
        success: false,
        message: macData.message || "Data not found.",
      });
    }
  } catch (error) {
    console.error("Error fetching MAC data:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
