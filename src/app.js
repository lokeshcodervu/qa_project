require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
// const xss = require("xss-clean");
const hpp = require("hpp");
const compression = require("compression");

const app = express();

app.disable('x-powered-by');
/* ======================
   SECURITY & PERFORMANCE
====================== */

// Compress responses
app.use(compression());

// Secure HTTP headers
app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy:
        process.env.NODE_ENV === "production"
          ? "same-site"
          : "cross-origin",
    },
  })
);  

// Prevent XSS attacks
// app.use(xss());

// Prevent HTTP param pollution
app.use(hpp());

// Body size limit (DoS protection)
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// Rate limiting (brute-force protection)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", limiter);

// CORS (safe default)
app.use(
  cors({
    origin: process.env.FRONTEND_URL
      ? process.env.FRONTEND_URL.split(",")
      : "*",
    credentials: true,
  })
);

/* ======================
   LOGGING
====================== */

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}
/* ======================
   ROUTES
====================== */
const superAdminRoutes = require("./routes/superAdminRoutes");
app.use("/api/super-admin", superAdminRoutes);

const usersRoutes = require("./routes/usersRoutes");
app.use("/api/users", usersRoutes);



app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Production server running 🚀",
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// 👉 your routes
// app.use("/api/users", require("./routes/user.routes"));


/* ======================
   404 HANDLER
====================== */

app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});

/* ======================
   GLOBAL ERROR HANDLER
====================== */

app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    status: "error",
    message:
      process.env.NODE_ENV === "production"
        ? "Something went wrong"
        : err.message,
  });
});

module.exports = app;
