const User = require("../../models/Users"); // Adjust the path as necessary

exports.getByMe = async (req, res) => {
  try {
    const id = req.user.id;
    const user = await User.findDetails({ id: id });
    console.log(user);
    if (user.success) {
      res.status(200).json({
        user: user.data,
        success: true,
        message: "data fetched successfully",
      });
    } else {
      return res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};
