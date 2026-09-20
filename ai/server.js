import "dotenv/config";
import express from "express";

import resumeRoutes from "./routes/resume.js";
import jobRoutes from "./routes/jobs.js";

const app = express();

const PORT = process.env.PORT || 5000;

const isAllowedOrigin = (origin) => {
  if (!origin) {
    return true;
  }

  try {
    const url = new URL(origin);

    return (
      url.protocol === "http:" &&
      url.hostname === "localhost"
    );
  } catch {
    return false;
  }
};

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (isAllowedOrigin(origin)) {
    res.header(
      "Access-Control-Allow-Origin",
      origin || "*"
    );
  }

  res.header(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS"
  );

  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  res.header(
    "Access-Control-Max-Age",
    "86400"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

app.use(
  express.json({
    limit: "2mb",
  })
);

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    service: "CareerPilot AI",
    status: "running",
  });
});

app.get("/api/debug", (req, res) => {
  res.json({
    success: true,
    server: "CareerPilot AI",
    version: "DYNAMIC-LOCALHOST-CORS",
    port: PORT,
    allowedOrigin: req.headers.origin || null,
  });
});

app.use(
  "/api/resume",
  resumeRoutes
);

app.use(
  "/api/jobs",
  jobRoutes
);

app.use((error, req, res, next) => {
  console.error(
    "CareerPilot AI Error:"
  );

  console.error(error);

  res.status(
    error.status || 500
  ).json({
    success: false,
    message:
      error.message ||
      "Something went wrong on the CareerPilot AI server.",
  });
});

app.listen(PORT, () => {
  console.log(
    "=========================================="
  );

  console.log(
    "CareerPilot AI Server"
  );

  console.log(
    "=========================================="
  );

  console.log(
    `Running on http://localhost:${PORT}`
  );

  console.log(
    "CORS: localhost origins allowed"
  );

  console.log(
    "Resume API: /api/resume/analyze"
  );

  console.log(
    "Jobs API: /api/jobs"
  );

  console.log(
    "=========================================="
  );
});