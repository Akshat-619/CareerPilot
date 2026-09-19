import "dotenv/config";
import express from "express";
import cors from "cors";

import resumeRoutes from "./routes/resume.js";
import jobRoutes from "./routes/jobs.js";

const app = express();

const PORT =
  process.env.PORT || 5000;


// ============================================================
// CORS
// ============================================================

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);


// ============================================================
// BODY PARSER
// ============================================================

app.use(
  express.json({
    limit: "2mb",
  })
);


// ============================================================
// HEALTH
// ============================================================

app.get(
  "/api/health",
  (req, res) => {
    res.json({
      success: true,
      service: "CareerPilot AI",
      status: "running",
    });
  }
);


// ============================================================
// ROUTES
// ============================================================

app.use(
  "/api/resume",
  resumeRoutes
);

app.use(
  "/api/jobs",
  jobRoutes
);


// ============================================================
// ERROR HANDLER
// ============================================================

app.use(
  (error, req, res, next) => {

    console.error(
      "CareerPilot AI Error:",
      error
    );

    res.status(
      error.status || 500
    ).json({
      success: false,

      message:
        error.message ||
        "Something went wrong on the CareerPilot AI server.",
    });
  }
);


// ============================================================
// START
// ============================================================

app.listen(
  PORT,
  () => {
    console.log(
      `CareerPilot AI running on http://localhost:${PORT}`
    );
  }
);