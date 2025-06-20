const jwt = require("jsonwebtoken");

const ensureAuthenticated = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res
      .status(401)
      .json({ message: "Unauthorized, JWT token is required" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized, JWT token malformed" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Unauthorized, JWT token invalid or expired" });
  }
};

module.exports = ensureAuthenticated;
