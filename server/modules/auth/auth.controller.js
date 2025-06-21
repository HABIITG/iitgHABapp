const axios = require("axios");
const qs = require("querystring");
const {
  getUserFromToken,
  User,
  findUserWithEmail,
} = require("../user/userModel.js"); // Assuming getUserFromToken is a named export
require("dotenv").config();

const appConfig = require("../../config/default.js");

const clientid = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const redirect_uri = process.env.REDIRECT_URI;
console.log("Redirect URI:", redirect_uri);

// Not used
const loginHandler = (req, res) => {
  res.redirect(
    `https://login.microsoftonline.com/850aa78d-94e1-4bc6-9cf3-8c11b530701c/oauth2/v2.0/authorize?client_id=${clientid}&response_type=code&redirect_uri=${redirect_uri}&scope=offline_access%20user.read&state=12345&prompt=consent`
  );
};

// Function to calculate semester (if needed)

const mobileRedirectHandler = async (req, res, next) => {
  try {
    const { code } = req.query;
    console.log("Authorization Code:", code);

    if (!code) {
      throw new AppError(400, "Authorization code is missing");
    }

    const data = qs.stringify({
      client_secret: clientSecret,
      client_id: clientid,
      redirect_uri: redirect_uri,
      scope: "user.read",
      grant_type: "authorization_code",
      code: code,
    });

    const config = {
      method: "post",
      url: `https://login.microsoftonline.com/850aa78d-94e1-4bc6-9cf3-8c11b530701c/oauth2/v2.0/token`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        client_secret: clientSecret,
      },
      data: data,
    };

    // Make the Axios request
    const response = await axios.post(config.url, config.data, {
      headers: config.headers,
    });

    // Check if the response data exists
    if (!response.data) throw new AppError(500, "Something went wrong");

    const AccessToken = response.data.access_token;
    console.log("access token ", AccessToken);
    const RefreshToken = response.data.refresh_token;
    console.log("refresh token is: ", RefreshToken);

    // Get user information from token
    const userFromToken = await getUserFromToken(AccessToken);

    // Check if user data exists
    if (!userFromToken || !userFromToken.data)
      throw new AppError(401, "Access Denied");

    const roll = userFromToken.data.surname;
    if (!roll) throw new AppError(401, "Sign in using Institute Account");

    // create an existing user instance with finduserwithemail
    let existingUser = await findUserWithEmail(userFromToken.data.mail);

    // If the user doesn't exist, create a new user

    if (!existingUser) {
      const userData = {
        name: userFromToken.data.displayName,
        degree: userFromToken.data.jobTitle,
        rollNumber: userFromToken.data.surname,
        email: userFromToken.data.mail,
      };

      //console.log(userData);

      const user = new User(userData);
      //console.log( "user model is",user);
      existingUser = await user.save();
    }

    // Generate JWT for the existing or new user
    const token = existingUser.generateJWT();
    //console.log(token);

    // Redirect to the success URL with the token
    return res.redirect(
      `iitgcomplain://success?token=${token}&user=${existingUser}`
    );
  } catch (error) {
    console.error("Error in mobileRedirectHandler:", error); // Log the error to the console
    // Use next to pass the error to the error handling middleware
    next(error); // Pass the error to the next middleware for centralized error handling
  }
};

const logoutHandler = (req, res, next) => {
  // res.clearCookie("token");
  res.cookie("token", "loggedout", {
    maxAge: 0,
    sameSite: "lax",
    secure: false,
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.redirect(appConfig.clientURL);
};

// Exporting the handlers
module.exports = {
  loginHandler,
  mobileRedirectHandler,
  logoutHandler,
};
