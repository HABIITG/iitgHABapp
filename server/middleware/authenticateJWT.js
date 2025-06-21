const { User } = require("../modules/user/userModel.js");
const { Hostel } = require("../modules/hostel/hostelModel.js");
const AppError = require("../utils/appError.js");

function auth(Schema, param) {
  return async function (req, res, next) {
    let token = req.cookies?.token;

    // Check for token in headers if not in cookies
    if (!token && req.headers?.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      } else {
        console.log("Authorization header format is invalid");
      }
    }
    // Log the source of the token
    if (token) {
      console.log("Token received from client:", token);
    } else {
      console.log("No token provided by the client");
    }

    // If token is missing, send error response
    if (!token) return next(new AppError(403, "Invalid token"));

    try {
      // Validate the token and find the element
      const found = await Schema.findByJWT(token);
      if (!found) return next(new AppError(403, "Not Authenticated"));

      // Attach the param to the request object
      req[param] = found;
      return next();
    } catch (err) {
      console.error("Error verifying token:", err);
      return next(new AppError(500, "Server error during authentication"));
    }
  };
}

const authenticateJWT = auth(User, "user");
const authenticateAdminJWT = auth(Hostel, "hostel");

module.exports = { authenticateJWT, authenticateAdminJWT };
