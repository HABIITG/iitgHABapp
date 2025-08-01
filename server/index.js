// server/index.js
//import authRoutes from "./modules/auth/auth.routes.js";
const authRoutes = require("./modules/auth/auth.routes.js");
const express = require("express");
const mongoose = require("mongoose");
const itemRoute = require("./modules/item/itemRoute.js");
const userRoute = require("./modules/user/userRoute.js");
const cookieParser = require("cookie-parser");
const complaintRoute = require("./modules/complaint/complaintRoute.js");
const feedbackRoute = require("./modules/feedback/feedbackRoute.js");
const hostelRoute = require("./modules/hostel/hostelRoute.js");
const qrRoute = require("./modules/qr/qrRoute.js");
const messRoute = require("./modules/mess/messRoute.js");
const logsRoute = require("./modules/mess/ScanLogsRoute.js");
// const cors = require("cors");

const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const {
  wednesdayScheduler,
  sundayScheduler,
} = require("./modules/hostel/hostelScheduler.js");
const {
  feedbackScheduler,
} = require("./modules/feedback/feedbackScheduler.js");

const {
  feedbackResetScheduler,
} = require("./modules/feedback/feedbackScheduler.js");
require("dotenv").config();

const app = express();
const MONGOdb_uri = process.env.MONGODB_URI;
const PORT = process.env.PORT || 3000;

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "IITG HAB API",
      version: "1.0.0",
      description: "API documentation for IITG HAB application",
      contact: {
        name: "API Support",
        email: "md.hassan@iitg.ac.in"
      },
    },
    servers: [
      {
        url: "https://hab.codingclub.in",
        description: "Production server",
      },
      {
        url: `http://localhost:${PORT}`,
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: [
    "./modules/**/*.js",
    "index.js",
  ]
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customSiteTitle: "IITG HAB API Documentation",
}));

app.get("/api/swagger.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});
// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//   })
// );

// Middleware
app.use(express.json());
// app.use(
//   cors({
//     origin: "http://localhost:5173", // your frontend port
//     credentials: true, // allow cookies
//   })
// );
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
mongoose
  .connect(MONGOdb_uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connected");

    wednesdayScheduler();

    sundayScheduler();

    feedbackScheduler();
    feedbackResetScheduler();
  })
  .catch((err) => console.log(err));

/**
 * @swagger
 * /:
 *  get:
 *     summary: "Health check endpoint"
 *     tags: ["Health"]
 *     responses:
 *      200:
 *       description: "Backend is running"
 */
app.get("/", (req, res) => {
  res.send("Backend is running");
});

/**
 * @swagger
 * /hello:
 *    get:
 *      summary: "Health check hello endpoint"
 *      tags: ["Health"]
 *      responses: 
 *        200:
 *          description: "Hello from server"
 */
app.get("/hello", (req, res) => {
  res.send("Hello from server");
});

// item route
app.use("/api/items", itemRoute);

// user route
app.use("/api/users", userRoute);

//complaint route
app.use("/api/complaints", complaintRoute);

//complaint route
app.use("/api/feedback", feedbackRoute);

//auth route
app.use("/api/auth", authRoutes);

//hostel route
app.use("/api/hostel", hostelRoute);

//qr route
app.use("/api/qr", qrRoute);

//mess route
app.use("/api/mess", messRoute);

//scanlogs route
app.use("/api/logs", logsRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
