const Course = require("../../models/Course");

exports.getCourses = async (req, res) => {
  try {
    console.log(req.query.id);
    const id = req.query ? req.query.id : null;
    let courses;

    if (id) {
      courses = await Course.getByUser({ id: id });
    } else {
      courses = await Course.getAll();
    }

    if (courses.success) {
      res.status(200).json({
        courses: courses.data,
        success: true,
        message: "Data fetched successfully",
      });
    } else {
      return res.status(404).json({ error: "Courses not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};
