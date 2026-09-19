import "dotenv/config";
import express from "express";

import resumeRoutes from "./routes/resume.js";
import jobRoutes from "./routes/jobs.js";

const app = express();

const PORT = process.env.PORT || 5000;


// ============================================================
// CORS — MANUAL
// ============================================================

app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    "http://localhost:5175"
  );

  res.header(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS"
  );

  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});


// ============================================================
// BODY
// ============================================================

app.use(
  express.json({
    limit: "2mb",
  })
);


// ============================================================
// HEALTH
// ============================================================

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    service: "CareerPilot AI",
    status: "running",
  });
});


// ============================================================
// DEBUG
// ============================================================

app.get("/api/debug", (req, res) => {
  res.json({
    success: true,
    server: "CareerPilot AI",
    version: "DIRECT-CORS-TEST",
    port: PORT,
  });
});


// ============================================================
// ROUTES
// ============================================================

app.use("/api/resume", resumeRoutes);

app.use("/api/jobs", jobRoutes);


// ============================================================
// ERROR
// ============================================================

app.use((error, req, res, next) => {
  console.error("CareerPilot AI Error:", error);

  res.status(error.status || 500).json({
    success: false,
    message:
      error.message ||
      "Something went wrong on the CareerPilot AI server.",
  });
});


// ============================================================
// START
// ============================================================

app.listen(PORT, () => {
  console.log(
    `CareerPilot AI running on http://localhost:${PORT}`
  );
});