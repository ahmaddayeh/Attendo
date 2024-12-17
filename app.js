const express = require("express");
const authRoutes = require("./routes/authRoutes");
const usersRoutes = require("./routes/usersRoutes");
const coursesRoutes = require("./routes/coursesRoutes");
const attendancesessionsRoutes = require("./routes/attendancesessionsRoutes");
const attendancesRoutes = require("./routes/attendancesRoutes");
const macAddressesRoutes = require("./routes/macAddressesRoutes");

const cors = require("cors");

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse URL-encoded bodies (form data)
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(cors());

// Define routes
app.use("/auth", authRoutes);

app.use("/users", usersRoutes);

app.use("/courses", coursesRoutes);

app.use("/attendance-sessions", attendancesessionsRoutes);

app.use("/attendance", attendancesRoutes);

app.use("/mac", macAddressesRoutes);

module.exports = app;
