const jwt = require("jsonwebtoken");

// Replace 'your-secret-key' with your actual secret key
const secretKey = process.env.JWT_SECRET;
const expiresIn = process.env.JWT_EXPIRES_IN;

const jwtMiddleware = (req, res, next) => {
  // Get the token from the headers
  const token = req.headers["authorization"]?.split(" ")[1]; // Assumes format: "Bearer <token>"

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  // Verify the token
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token." });
    }

    // Attach user information to request object
    req.user = decoded;
    req.userId = decoded.id; // Assuming the token contains a user ID field named 'id'
    next(); // Proceed to the next middleware or route handler
  });
};

module.exports = jwtMiddleware;
