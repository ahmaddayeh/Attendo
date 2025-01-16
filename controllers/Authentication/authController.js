const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Auth = require("../../models/Authentication");
require("dotenv").config();

const secret = process.env.JWT_SECRET;
const expiresIn = process.env.JWT_EXPIRES_IN;

// Register a new user
exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await Auth.findByEmail(email);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (existingUser.found === true) {
      const user = await Auth.set({
        email,
        password: hashedPassword,
      });
      if (user.success) {
        return res.status(200).json({
          success: true,
          message: "User created successfully",
        });
      } else {
        return res.status(400).json({
          error: "An error has occurred setting your password, contact admins",
        });
      }
    } else {
      return res.status(400).json({ error: "User not found, contact admins" });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.message });
  }
};

// Login a user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Auth.findByEmail(email);
    if (user.found) {
      if (!user || !(await bcrypt.compare(password, user.data.password))) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
      console.log(user);
      const token = jwt.sign({ id: user.data.id }, secret, {
        expiresIn: expiresIn,
      });
      res.json({ token });
    } else {
      return res.status(400).json({ error: "User Not Found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await Auth.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const id = req.params.id;

    const { first_name, last_name } = req.body;
    const user = await Auth.findById({ id });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    await user.update({ first_name, last_name });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete user account
exports.deleteAccount = async (req, res) => {
  try {
    const id = req.params.id;

    const user = await Auth.findById({ id });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    await user.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
