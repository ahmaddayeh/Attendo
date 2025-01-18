const jwt = require("jsonwebtoken");

const secretKey = process.env.JWT_SECRET;
const expiresIn = process.env.JWT_EXPIRES_IN;

const jwtMiddleware = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Assumes format: "Bearer <token>"

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token." });
    }

    req.user = decoded;
    req.userId = decoded.id;
    next();
  });
};

module.exports = jwtMiddleware;
